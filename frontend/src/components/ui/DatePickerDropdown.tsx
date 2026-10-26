import { useState, useRef, useEffect } from "react";
import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";
import { Calendar } from "./calendar";
import { formatDate } from "../../utils/chartUtils";

const JAN_START = new Date(2026, 0, 1);
const JAN_END = new Date(2026, 0, 31);

export function isOutsideJan2026(date: Date): boolean {
  return date < JAN_START || date > JAN_END;
}

interface Props {
  value: Date;
  onChange: (date: Date) => void;
}

export function DatePickerDropdown({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 px-3.5 py-2.5
          bg-white border border-slate-200 rounded-sm text-sm font-semibold text-slate-700
          hover:border-slate-300 hover:bg-slate-50 transition-all duration-150 cursor-pointer"
      >
        <span className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-slate-400" strokeWidth={1.75} />
          {formatDate(value)}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={2}
        />
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute z-50 top-full mt-2 left-0
          bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden
          [&_.rdp]:p-0
          [&_.rdp-caption_select]:text-xs [&_.rdp-caption_select]:rounded-md
          [&_.rdp-caption_select]:border [&_.rdp-caption_select]:border-slate-200
          [&_.rdp-caption_select]:bg-white [&_.rdp-caption_select]:px-1.5 [&_.rdp-caption_select]:py-1
          [&_.rdp-caption_select]:font-semibold [&_.rdp-caption_select]:text-slate-700
          [&_.rdp-caption_select:focus]:outline-none [&_.rdp-caption_select:focus]:ring-2
          [&_.rdp-caption_select:focus]:ring-slate-400
          [&_.rdp-day_button]:text-xs [&_.rdp-day_button]:font-semibold
          [&_.rdp-day_button:hover:not([disabled])]:bg-slate-100
          [&_.rdp-day_button[aria-disabled=true]]:opacity-30
          [&_.rdp-day_button[aria-disabled=true]]:cursor-not-allowed
          [&_.rdp-day_button[aria-selected=true]]:!bg-slate-900 [&_.rdp-day_button[aria-selected=true]]:!text-white
          [&_.rdp-nav_button]:text-slate-400 [&_.rdp-nav_button:hover]:bg-slate-100
          [&_.rdp-head_cell]:text-[10px] [&_.rdp-head_cell]:font-bold [&_.rdp-head_cell]:text-slate-400
          [&_.rdp-caption_label]:text-sm [&_.rdp-caption_label]:font-bold [&_.rdp-caption_label]:text-slate-800"
        >
          <div className="px-1 pt-1">
            <Calendar
              mode="single"
              selected={value}
              onSelect={(date) => {
                if (date && !isOutsideJan2026(date)) {
                  onChange(date);
                  setOpen(false);
                }
              }}
              defaultMonth={JAN_START}
              captionLayout="dropdown"
              startMonth={new Date(2020, 0)}
              endMonth={new Date(2030, 11)}
              disabled={isOutsideJan2026}
              showOutsideDays={false}
              className="[--cell-size:--spacing(8)]"
            />
          </div>
          <p className="text-[10px] text-slate-400 text-center py-2 border-t border-slate-100">
            Only Jan 2026 dates are selectable
          </p>
        </div>
      )}
    </div>
  );
}
