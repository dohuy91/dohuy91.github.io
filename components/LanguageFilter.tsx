'use client'

type LanguageOption = 'all' | 'en' | 'vi'

interface LanguageFilterProps {
  counts: Record<LanguageOption, number>
  value: LanguageOption
  onChange: (value: LanguageOption) => void
}

const options: Array<{ value: LanguageOption; label: string }> = [
  { value: 'all', label: 'All' },
  { value: 'en', label: 'English' },
  { value: 'vi', label: 'Tieng Viet' },
]

export default function LanguageFilter({ counts, value, onChange }: LanguageFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const isActive = option.value === value

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`rounded-full border px-3 py-1 text-sm transition ${
              isActive
                ? 'border-gray-900 bg-gray-900 text-white dark:border-gray-100 dark:bg-gray-100 dark:text-gray-900'
                : 'border-gray-300 bg-white text-gray-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
            }`}
          >
            {option.label} ({counts[option.value]})
          </button>
        )
      })}
    </div>
  )
}
