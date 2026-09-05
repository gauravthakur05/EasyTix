const groupByRow = (seats) => {
  const rows = {};
  seats.forEach((seat) => {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });
  Object.values(rows).forEach((row) => row.sort((a, b) => a.number - b.number));
  return rows;
};

export default function SeatMap({ seats, selectedSeats, onToggleSeat, maxSelectable = 8 }) {
  const rows = groupByRow(seats);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="mb-6 flex justify-center">
        <div className="w-full max-w-md rounded-full bg-slate-800 py-2 text-center text-xs font-semibold uppercase tracking-widest text-white">
          Stage / Screen
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        {Object.keys(rows)
          .sort()
          .map((rowKey) => (
            <div key={rowKey} className="flex items-center gap-2">
              <span className="w-5 text-xs font-bold text-slate-400">{rowKey}</span>
              <div className="flex gap-2">
                {rows[rowKey].map((seat) => {
                  const isBooked = seat.status === "BOOKED";
                  const isSelected = selectedSeats.includes(seat.seatId);
                  const disableNewSelection =
                    !isSelected && selectedSeats.length >= maxSelectable && maxSelectable > 0;

                  return (
                    <button
                      key={seat.seatId}
                      type="button"
                      disabled={isBooked || disableNewSelection}
                      onClick={() => onToggleSeat(seat.seatId)}
                      title={seat.seatId}
                      className={`seat-btn grid h-9 w-9 place-items-center rounded-lg text-xs font-semibold shadow-sm ${
                        isBooked
                          ? "cursor-not-allowed bg-slate-200 text-slate-400"
                          : isSelected
                          ? "bg-brand-600 text-white"
                          : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                      } ${disableNewSelection && !isSelected ? "opacity-50" : ""}`}
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-5 text-xs font-medium text-slate-600">
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-emerald-100"></span> Available
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-brand-600"></span> Selected
        </span>
        <span className="flex items-center gap-2">
          <span className="h-4 w-4 rounded bg-slate-200"></span> Booked
        </span>
      </div>
    </div>
  );
}
