import { useState } from "react";
import "../../styles/layout.css"

function Input({
  type,
  name,
  id,
  placeholder,
  value,
  onChange,
  maxLength,
  minLength,
  error,
  inputMode,
  pattern,
  required = false,
}) {
  const [focused, setFocused] = useState(false);
  
  const inputId = id || name;
  const errorId = error ? `${inputId}-error` : undefined;

  return (
    <div className="form-field">
      <label
        htmlFor={name}
        className={focused || value ? "visible" : ""}
      >
        {placeholder}
      </label>

      <input
        type={type}
        id={inputId}
        name={name}
        placeholder={focused ? "" : placeholder}
        value={value}
        maxLength={maxLength}
        minLength={minLength}
        inputMode={inputMode}
        pattern={pattern}
        required={required}
        aria-invalid={!!error}
        aria-describedby={errorId}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => !value && setFocused(false)}
      />

      {error && (
        <p id={`${name}-error`} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default Input;
