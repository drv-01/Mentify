const { PrismaClient } = require("@prisma/client");

const RETRYABLE = ['E57P01', 'P1001', 'P1002', 'P1008', 'P1017', 'terminating connection'];

const createClient = () => new PrismaClient({ log: ['error'], errorFormat: 'pretty' });

let prisma = createClient();

const withRetry = async (fn) => {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isRetryable = RETRYABLE.some(code => err.message?.includes(code) || err.code === code);
      if (isRetryable && attempt < 2) {
        try { await prisma.$disconnect(); } catch (_) {}
        prisma = createClient();
        await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
      } else {
        throw err;
      }
    }
  }
};

const handler = {
  get(_, prop) {
    const value = prisma[prop];
    if (value && typeof value === 'object' && !prop.startsWith('$') && !prop.startsWith('_')) {
      return new Proxy(value, {
        get(modelTarget, method) {
          const fn = modelTarget[method];
          if (typeof fn === 'function') {
            return (...args) => withRetry(() => prisma[prop][method](...args));
          }
          return fn;
        }
      });
    }
    return typeof value === 'function' ? value.bind(prisma) : value;
  }
};

const proxiedPrisma = new Proxy({}, handler);

const handleShutdown = async () => {
  try { await prisma.$disconnect(); } catch (_) {}
  process.exit(0);
};

process.on('SIGINT', handleShutdown);
process.on('SIGTERM', handleShutdown);

module.exports = proxiedPrisma;
