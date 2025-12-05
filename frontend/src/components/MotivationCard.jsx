const quotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "Believe you can and you're halfway there. - Theodore Roosevelt",
  "The secret of getting ahead is getting started. - Mark Twain",
  "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
  "Every moment is a fresh beginning. - T.S. Eliot",
  "Your only limit is your mind.",
  "Small steps every day lead to big results."
];

const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

export default function MotivationCard({ isToggled }) {
  return (
    <div className="mb-12 rounded-lg relative overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200"
          alt="Sunrise Mountains"
          className="w-full h-full object-cover"
        />
        <div className={`absolute inset-0 ${
          isToggled ? "bg-gray-900/70" : "bg-white/80"
        }`}></div>
      </div>

      <div className="relative z-10 p-6">
        <h3 className="text-xl font-bold mb-3 text-gray-900">
          💡 Daily Inspiration
        </h3>

        <p className="text-sm text-gray-700">
          "{randomQuote}"
        </p>
      </div>
    </div>
  );
}