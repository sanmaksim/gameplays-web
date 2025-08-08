import {
    CSSObjectWithLabel,
    InputActionMeta,
    MultiValue,
    OptionProps,
    SelectInstance,
    SingleValue
} from 'react-select';
import { CSSProperties, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLazySearchQuery } from '../slices/gamesApiSlice';
import AsyncSelect from 'react-select/async';
import debounce from 'lodash.debounce';
import type { GameSearchResult, GameSearchResults } from '../types/GameTypes';

interface Option extends GameSearchResult {
    isDivider?: boolean, // used for custom react-select styling
    label?: string,
    url?: string
}

type Options = Option[];

function SearchBar() {
    const navigate = useNavigate();

    // track user entered input
    const [inputValue, setInputValue] = useState<string>('');

    // track a single AsyncSelect option
    const [option, setOption] = useState<SingleValue<Option> | null>(null);

    // track a list of AsyncSelect options
    const [options, setOptions] = useState<Options>([]);

    // initialize ref object with the 'current' property set to null
    // ref selection is required for AsyncSelect's blur() and clearValue() methods
    const selectRef = useRef<SelectInstance<Option, boolean> | null>(null);

    // Setup game search query trigger
    const [triggerSearchQuery] = useLazySearchQuery();

    // run post-render effects
    useEffect(() => {
        // clear the current option on route changes
        setOption(null);
    }, [location]);

    // handle the current AsyncSelect option
    const handleChange = (currentOption: SingleValue<Option> | MultiValue<Option>): void => {
        // nav to the url of the selected option
        try {
            if (currentOption
                && 'url' in currentOption
                && currentOption.url !== undefined) {
                navigate(currentOption.url);
            } else {
                throw new Error('Error on navigate.');
            }
        } catch (error: unknown) {
            if (error instanceof Error) {
                toast.error('Error on navigate.');
                console.error(error);
            } else {
                toast.error('Uknown error occurred');
                console.error(error);
            }
        }
    };

    // handle AsyncSelect input change
    const handleInputChange = (inputString: string, actionMeta: InputActionMeta): void => {
        // set the input value to the user entered input but do not update the 
        // in-built input-blur and menu-close actions to prevent the user input from 
        // being cleared by react-select's default behaviour
        if (actionMeta.action !== 'input-blur' && actionMeta.action !== 'menu-close') {
            setInputValue(inputString);
        }
        // clear the Options array if the input value is empty
        if (inputValue.trim() === '') {
            setOptions([]);
        }
    };

    // handle AsyncSelect keydown
    const handleKeyDown = (evt: KeyboardEvent): void => {
        if (evt.key === 'Enter') {
            evt.preventDefault();
            selectRef.current?.blur(); // close the options menu
            if (inputValue.trim()) {
                navigate(`/search?q=${encodeURIComponent(inputValue)}`);
            }
        }
    };

    /**
     * Function that converts debounced game results into AsyncSelect options
     * - Leverage useRef to ensure the debounce timer does not reset each 
     *   time the input string is updated and the component re-rendered
     */
    const debouncedFetchGameData = useRef(
        debounce(async (inputString: string, callback: (options: Options) => void): Promise<void> => {
            try {
                if (inputString.trim() === '') {
                    callback([]); // clear options
                    return; // prevent API call
                }
                console.log("Input Value: ", inputString);
                // Trigger the game search query
                const searchQueryData: GameSearchResults = await triggerSearchQuery({
                    queryParams: { q: encodeURIComponent(inputString) }
                }).unwrap();
                if (!searchQueryData) {
                    throw new Error('Error returning game data.');
                }
                
                // Pre-populate the options array for use with react-select
                let searchOptions: Options;
                if (searchQueryData
                    && searchQueryData.results !== undefined) {
                    // Copy each search result into the options array
                    searchOptions = searchQueryData.results.map((result: GameSearchResult) => ({
                        ...result,
                        isDivider: true,
                        label: result.name,
                        url: `/game/${result.id}`
                    }));

                    // Add "Show more results" to the options list
                    searchOptions.push({
                        isDivider: false,
                        label: "Show more results...",
                        url: `/search?q=${encodeURIComponent(inputString)}`
                    });
                    setOptions(searchOptions);
                    callback(searchOptions);
                }
            } catch (error) {
                console.error('Error displaying results:', error);
                toast.error('Failed to display results.');
                callback([]);
            }
        }, 500)
    ).current;

    // Load options into react-select menu after debounce delay
    const loadOption = async (inputString: string): Promise<Options> => {
        return new Promise<Options>((resolve) => {
            debouncedFetchGameData(inputString, resolve);
        });
    };

    // custom react-select option component with custom styles
    const CustomOption = (props: OptionProps<Option>): JSX.Element => {
        const { data, innerRef, innerProps, getStyles }: OptionProps<Option> = props;

        // retrieve styles for the 'option' inner component
        const optionStyles = getStyles('option', props) as CSSProperties; // cast CSSObjectWithLabel to React.CSSProperties for compatibility

        let formattedDate: string;
        if (data.original_release_date) {
            const dateString: string = data.original_release_date;
            const date: Date = new Date(dateString);
            formattedDate = new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(date));
        }

        return (
            <>
                <div className="d-flex" ref={innerRef} {...innerProps} style={{ ...optionStyles }}>
                    {data.image
                        && data.url
                        && data.image.tiny_url ? (
                        <>
                            <img src={data.image.tiny_url} alt={data.label} className="me-2" />
                            <div>
                                <Link to={data.url} style={{ textDecoration: 'none', color: 'inherit' }}>{data.label}</Link> - {formattedDate!}
                            </div>
                        </>
                    ) : data.url && (
                        <div>
                            <Link to={data.url} style={{ textDecoration: 'none', color: 'inherit' }}>{data.label}</Link>
                        </div>
                    )}
                </div>
                {data.isDivider && <hr style={{ margin: 0 }} />}
            </>
        );
    };

    const customStyles = {
        menu: (menuStyles: CSSObjectWithLabel) => ({
            ...menuStyles,
            maxHeight: 'none' // remove the height limit for the menu
        }),
        menuList: (menuListStyles: CSSObjectWithLabel) => ({
            ...menuListStyles,
            maxHeight: 'none' // ensure the inner list expands too
        }),
        option: (optionStyles: CSSObjectWithLabel, state: { isFocused: boolean }) => ({
            ...optionStyles,
            backgroundColor: state.isFocused ? 'black' : 'white',
            color: state.isFocused ? 'white' : 'black',
            cursor: 'pointer',
            padding: '5px',
            textDecoration: state.isFocused ? 'underline' : 'none',
            transition: 'background-color 0.2s ease'
        })
    };

    return (
        <AsyncSelect
            className="w-50"
            components={{
                DropdownIndicator: null,
                Option: CustomOption
            }}
            defaultOptions={options}
            inputValue={inputValue}
            isSearchable={true}
            loadOptions={loadOption}
            loadingMessage={() => "Searching..."}
            noOptionsMessage={() => "No results"}
            onChange={handleChange}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            options={options}
            placeholder="Search Games"
            ref={selectRef} // react automatically sets the 'current' property of the ref to the instance of the AsyncSelect object after the component is mounted
            styles={customStyles}
            value={option}
        />
    )
}

export default SearchBar;
