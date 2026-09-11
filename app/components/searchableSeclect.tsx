import { useState } from "react";

function SearchableSelect({
  value,
  options,
  placeholder,
  onChange,
  isVehicle = false,
}: {
  value: number;
  options: any[];
  placeholder: string;
  onChange: (value: number) => void;
  isVehicle?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const sortedOptions = [...options].sort((a, b) => {
    const nameA = isVehicle ? a.vehicleNumber : a.name;
    const nameB = isVehicle ? b.vehicleNumber : b.name;

    return nameA.localeCompare(nameB, undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });

  const filteredOptions = sortedOptions.filter((item) => {
    const name = isVehicle ? item.vehicleNumber : item.name;

    return name.toLowerCase().includes(search.toLowerCase());
  });

  const selectedOption = options.find((item) => item.id === value);

  const selectedLabel = selectedOption
    ? isVehicle
      ? selectedOption.vehicleNumber
      : selectedOption.name
    : "";

  return (
    <div className="relative">
      {/* Selected value */}
      <button
        type="button"
        onClick={() => {
          setOpen((prev) => !prev);
          setSearch("");
        }}
        className="
          flex w-full items-center justify-between
          rounded-xl border border-neutral-200
          bg-white px-4 py-3
          text-left text-sm
          shadow-sm
          transition
          hover:border-neutral-300
          focus:border-primary
          focus:outline-none
          focus:ring-2
          focus:ring-primary/10
        "
      >
        <span
          className={
            selectedLabel
              ? "text-neutral-900"
              : "text-neutral-400"
          }
        >
          {selectedLabel || placeholder}
        </span>

        <span
          className={`text-neutral-400 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          ▾
        </span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">

          {/* Search */}
          <div className="border-b border-neutral-100 p-2">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className="
                w-full rounded-lg
                bg-neutral-50
                px-3 py-2.5
                text-sm text-neutral-900
                outline-none
                placeholder:text-neutral-400
                focus:ring-2
                focus:ring-primary/10
              "
            />
          </div>

          {/* Options */}
          <div className="max-h-60 overflow-y-auto">

            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-neutral-400">
                No results found
              </div>
            ) : (
              filteredOptions.map((item) => {
                const label = isVehicle
                  ? item.vehicleNumber
                  : item.name;

                const isSelected = item.id === value;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.id);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`
                      flex w-full items-center justify-between
                      px-4 py-3
                      text-left text-sm
                      transition
                      ${
                        isSelected
                          ? "bg-primary/10 text-primary"
                          : "text-neutral-700 hover:bg-neutral-50"
                      }
                    `}
                  >
                    <span>{label}</span>

                    {isSelected && (
                      <span className="font-semibold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })
            )}

          </div>
        </div>
      )}
    </div>
  );
}

export default SearchableSelect;
