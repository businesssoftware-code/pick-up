import { useEffect, useRef, useState } from "react";
type BaseOption = { id: number; name: string };
type VehicleOption = { id: number; vehicleNumber: string };
type SearchableSelectProps = {
  value: number;
  options: BaseOption[] | VehicleOption[];
  placeholder: string;
  onChange: (value: number) => void;
  isVehicle?: boolean;
};
/** * Keeps track of the currently open SearchableSelect. * This allows multiple SearchableSelect components * to automatically close each other. */ let activeDropdown:
  | string
  | null = null;
const dropdownListeners = new Set<(id: string | null) => void>();
const notifyDropdownChange = (id: string | null) => {
  activeDropdown = id;
  dropdownListeners.forEach((listener) => {
    listener(id);
  });
};
function SearchableSelect({
  value,
  options,
  placeholder,
  onChange,
  isVehicle = false,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  /** * Unique ID for this particular dropdown instance. */ const dropdownIdRef =
    useRef(`searchable-select-${Math.random().toString(36).slice(2)}`);
  const dropdownId = dropdownIdRef.current;
  /** * Get the display label depending on the option type. */ const getLabel =
    (item: BaseOption | VehicleOption): string => {
      if (isVehicle) {
        return (item as VehicleOption).vehicleNumber;
      }
      return (item as BaseOption).name;
    };
  /** * Listen for another SearchableSelect being opened. * If another dropdown opens, close this one. */ useEffect(() => {
    const handleDropdownChange = (id: string | null) => {
      if (id !== dropdownId) {
        setOpen(false);
        setSearch("");
      }
    };
    dropdownListeners.add(handleDropdownChange);
    return () => {
      dropdownListeners.delete(handleDropdownChange);
      if (activeDropdown === dropdownId) {
        activeDropdown = null;
      }
    };
  }, [dropdownId]);
  /** * Close dropdown when clicking outside. */ useEffect(() => {
    if (!open) {
      return;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
        if (activeDropdown === dropdownId) {
          notifyDropdownChange(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, dropdownId]);
  /** * Sort options alphabetically/numerically. */ const sortedOptions = [
    ...options,
  ].sort((a, b) => {
    return getLabel(a).localeCompare(getLabel(b), undefined, {
      numeric: true,
      sensitivity: "base",
    });
  });
  /** * Filter options based on search. */ const filteredOptions =
    sortedOptions.filter((item) => {
      return getLabel(item).toLowerCase().includes(search.toLowerCase());
    });
  /** * Find currently selected option. */ const selectedOption = options.find(
    (item) => item.id === value,
  );
  const selectedLabel = selectedOption ? getLabel(selectedOption) : "";
  /** * Open/close dropdown. */ const toggleDropdown = () => {
    if (open) {
      setOpen(false);
      setSearch("");
      if (activeDropdown === dropdownId) {
        notifyDropdownChange(null);
      }
      return;
    }
    /** * Opening this dropdown automatically * closes any other SearchableSelect. */ notifyDropdownChange(
      dropdownId,
    );
    setOpen(true);
    setSearch("");
  };
  /** * Select an option. */ const handleSelect = (id: number) => {
    onChange(id);
    setOpen(false);
    setSearch("");
    if (activeDropdown === dropdownId) {
      notifyDropdownChange(null);
    }
  };
  return (
    <div ref={containerRef} className="relative">
      {" "}
      {/* Selected value */}{" "}
      <button
        type="button"
        onClick={toggleDropdown}
        className=" flex w-full items-center justify-between rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left text-sm shadow-sm transition hover:border-neutral-300 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10 "
      >
        {" "}
        <span
          className={selectedLabel ? "text-neutral-900" : "text-neutral-400"}
        >
          {" "}
          {selectedLabel || placeholder}{" "}
        </span>{" "}
        <span
          className={`text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`}
        >
          {" "}
          ▾{" "}
        </span>{" "}
      </button>{" "}
      {/* Dropdown */}{" "}
      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-lg">
          {" "}
          {/* Search */}{" "}
          <div className="border-b border-neutral-100 p-2">
            {" "}
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={placeholder}
              className=" w-full rounded-lg bg-neutral-50 px-3 py-2.5 text-sm text-neutral-900 outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-primary/10 "
            />{" "}
          </div>{" "}
          {/* Options */}{" "}
          <div className="max-h-60 overflow-y-auto">
            {" "}
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-neutral-400">
                {" "}
                No results found{" "}
              </div>
            ) : (
              filteredOptions.map((item) => {
                const label = getLabel(item);
                const isSelected = item.id === value;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(item.id)}
                    className={` flex w-full items-center justify-between px-4 py-3 text-left text-sm transition ${isSelected ? "bg-primary/10 text-primary" : "text-neutral-700 hover:bg-neutral-50"} `}
                  >
                    {" "}
                    <span>{label}</span>{" "}
                    {isSelected && (
                      <span className="font-semibold"> ✓ </span>
                    )}{" "}
                  </button>
                );
              })
            )}{" "}
          </div>{" "}
        </div>
      )}{" "}
    </div>
  );
}
export default SearchableSelect;
