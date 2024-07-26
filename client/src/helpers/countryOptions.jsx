import countryList from "react-select-country-list";

/** Provides an array of country options for use in a dropdown or select component.
 * The options include the country name, country code, and a flag icon.
 * The options are derived from the `react-select-country-list` library.
 *
 * @returns {Array<{ labelForSearch: string, value: string, label: React.ReactNode }>} An array of country options.
 */

export const countryOptions = countryList()
  .getData()
  .map((country) => ({
    labelForSearch: country.label, // This will be used for search
    value: country.value,
    label: (
      <span>
        <span
          className={`fi fi-${country.value.toLowerCase()}`}
          style={{ marginRight: "8px" }}
        ></span>
        {country.label}
      </span>
    ),
  }));
