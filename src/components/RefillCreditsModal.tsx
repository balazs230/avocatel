interface RefillCreditsModalProps {
  userId: string;
  setIsRefillModalOpen: (value: boolean) => void;
}

interface CreditPackage {
  credits: number;
  priceId: string;
  label: string;
  buttonClass: string;
}

const creditPackages: CreditPackage[] = [
  {
    credits: 3,
    priceId: "price_1QzkhrC6GhLmHVjlQY9FTGxG",
    label: "3 Credits - 5 RON",
    buttonClass: "bg-amber-500",
  },
  {
    credits: 10,
    priceId: "price_1QzhQ0C6GhLmHVjlaZocKJi0",
    label: "10 Credits - 10 RON",
    buttonClass: "bg-amber-600",
  },
  {
    credits: 25,
    priceId: "price_1QzhQ0C6GhLmHVjlxhHXptcV",
    label: "25 Credits - 20 RON",
    buttonClass: "bg-amber-700",
  },
  {
    credits: 50,
    priceId: "price_1QzhQ0C6GhLmHVjlzaboVGVo",
    label: "50 Credits - 40 RON",
    buttonClass: "bg-amber-800",
  },
];

export const RefillCreditsModal: React.FC<RefillCreditsModalProps> = ({
  userId,
  setIsRefillModalOpen,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white text-black p-6 rounded-lg shadow-lg w-1/3">
        <h2 className="text-2xl mb-4">Refill Credits</h2>
        <p className="mb-4">Choose a refill package:</p>
        <div className="flex flex-col gap-3">
          {creditPackages.map((pack) => (
            <form
              key={pack.priceId}
              action="/api/checkout_sessions"
              method="POST"
            >
              <input type="hidden" name="credits" value={pack.credits} />
              <input type="hidden" name="priceId" value={pack.priceId} />
              <input type="hidden" name="userId" value={userId} />
              <button
                type="submit"
                role="link"
                className={`${pack.buttonClass} text-white px-4 py-2 rounded w-full`}
              >
                {pack.label}
              </button>
            </form>
          ))}
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={() => setIsRefillModalOpen(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
