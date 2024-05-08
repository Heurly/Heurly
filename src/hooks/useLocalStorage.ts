import { TLog, log } from "@/logger/logger";
import { useEffect, useState } from "react";

const useLocalStorage = <T>(
	key: string,
	initialValue: T,
): [T, (value: T) => void] => {
	const [storedValue, setStoredValue] = useState(initialValue);

	useEffect(() => {
		try {
			// Retrieve from localStorage
			const item = window.localStorage.getItem(key);
			if (item) {
				setStoredValue(JSON.parse(item) as T);
			}
		} catch (e) {
			log({
				type: TLog.error,
				text: `Unable to update local storage: Invalid content for key ""${key}`,
			});
		}
	}, [key]);

	const setValue = (value: T) => {
		log({ type: TLog.info, text: "Saved editor content to cache." });
		// Save state
		setStoredValue(value);
		// Save to localStorage
		window.localStorage.setItem(key, JSON.stringify(value));
	};
	return [storedValue, setValue];
};

export default useLocalStorage;
