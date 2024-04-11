import { Combobox } from '@headlessui/react';
import { Fragment, ReactNode, JSX, useState, useMemo, useCallback } from 'react';
import _ from 'lodash';
import { CheckIcon } from '@heroicons/react/24/solid';
import { Float } from '@headlessui-float/react';
import { Placement } from '@floating-ui/react';
import Fuse, { FuseResult, IFuseOptions } from 'fuse.js';
import classNames from '../utils/class-names.ts';

export type ListItemComponent<T> = (props: ListItemProps<T>) => ReactNode;
export type ListItemProps<T> = { item: T; active?: boolean; selected?: boolean; isOption?: boolean };

export type SearchListItemProps<T> = ListItemProps<T> & { searchMetadata: FuseResult<T> };
export type SearchListItemComponent<T> = (props: SearchListItemProps<T>) => ReactNode;

export interface ListInputProps<T> {
  valueKey: keyof T | string;
  value: T[];
  onChange: (newList: T[]) => void;
  placeholder?: string;
  options: T[];
  onQueryChanged?: (query: string) => void;
  ListItem: ListItemComponent<T>;
  NoOptionsMessage?: ReactNode;
  placement?: Placement;
  disabled?: boolean;
}

export interface ListSearchProps<T> {
  searchSettings?: IFuseOptions<T>;
  onSearch?: (results: FuseResult<T>[]) => void;
  /** Given the searched list, output a custom list of options. This output is what is shown in the list. */
  filterOptions?: (options: FuseResult<T>[], searchQuery: string) => FuseResult<T>[];
  ListItem: SearchListItemComponent<T>;
}

/**
 * ListInput is a semi-controlled component that allows the user to select items from a searchable list.
 * You can display the list items in a custom way, and filter them based on a search query, or custom logic.
 * By default, it uses the Fuse.js library to perform fuzzy search on the list items, if no setting is provided, you search upon the `Item[valueKey]`.
 *
 * Selection is still stateless. Provide a value and onChange to control the selected items.
 * @param onSearch
 * @param searchSettings
 * @param ListItem
 * @param props
 * @constructor
 */
export function ListInput<T>({
  onSearch,
  searchSettings,
  ListItem,
  ...props
}: ListInputProps<T> & ListSearchProps<T>): JSX.Element {
  // Handle query state
  const [searchQuery, setSearchQuery] = useState('');
  const { onQueryChanged } = props;
  const handleQueryChanged = useCallback(
    (query: string) => {
      setSearchQuery(query);
      onQueryChanged?.(query);
    },
    [onQueryChanged],
  );

  // Setup fuzzy search
  const fuseSearch = useMemo(() => {
    return new Fuse(
      props.options,
      searchSettings ?? {
        keys: [
          String(props.valueKey),
          ...Object.entries(props.options[0] ?? {})
            .filter(([, value]) => typeof value === 'string')
            .map(([key]) => key),
        ],
      },
    );
  }, [props.options, props.valueKey, searchSettings]);

  // Filter items based on search query, or custom override
  const filteredItems: FuseResult<T>[] = useMemo(() => {
    let items: FuseResult<T>[];
    if (searchQuery) {
      const results = fuseSearch.search(searchQuery);
      onSearch?.(results);
      items = results;
    } else items = props.options.map((item, refIndex) => ({ item, refIndex }));

    return props.filterOptions?.(items, searchQuery) ?? items;
  }, [searchQuery, props, fuseSearch, onSearch]);

  return (
    <ListInputComponent<FuseResult<T>>
      {...props}
      valueKey={`item.${String(props.valueKey)}`}
      options={filteredItems}
      onChange={(newList) => props.onChange(newList.map((item) => item.item))}
      value={props.value.map((item, refIndex) => ({
        item,
        refIndex,
      }))}
      ListItem={(listItemProps) => (
        <ListItem
          key={listItemProps.item.refIndex}
          {...listItemProps}
          searchMetadata={listItemProps.item}
          item={listItemProps.item.item}
        />
      )}
      onQueryChanged={handleQueryChanged}
    />
  );
}

/**
 * ListInputComponent renders a HeadlessUI combobox
 * and some styling for selection. It's a controlled component.
 * @param valueKey - The key to use for the unique value of each item
 * @param value - The current value of the list
 * @param onChange - The callback to call when the list changes
 * @param onQueryChanged - The callback to call when the search query changes
 * @param options - The list of options to display in the box. Not affected by search query.
 * @param ListItem - The component to use to render each item in the list
 * @param NoOptionsMessage - The message to display when the search query returns no results
 * @param props - The props to pass to the Combobox
 * @constructor
 */
function ListInputComponent<T>({
  valueKey,
  value,
  onChange,
  onQueryChanged,
  options,
  ListItem,
  NoOptionsMessage = 'Search query returned no results',
  ...props
}: ListInputProps<T>) {
  return (
    <Combobox<T[]> value={value} onChange={onChange} by={(a, b) => _.get(a, valueKey) === _.get(b, valueKey)} multiple>
      <Float as="div" className="relative" portal flip adaptiveWidth placement={props.placement}>
        <div className="relative flex w-full flex-wrap items-center gap-1 p-2">
          {value.map((item) => (
            <ListItem isOption={false} active={false} selected={false} key={_.get(item, valueKey)} item={item} />
          ))}
          <Combobox.Input
            className="border-none bg-transparent text-white outline-none focus:outline-none focus:ring-0"
            placeholder={props.placeholder}
            aria-disabled={props.disabled}
            onChange={(event) => onQueryChanged?.(event.target.value)}
            displayValue={() => ''}
          />
        </div>
        <Combobox.Options>
          <div className="border-1 grid max-h-[30vh] gap-1 overflow-x-hidden overflow-y-scroll rounded-lg border-gray-900 bg-gray-800 px-2 py-5">
            {options.map((option) => (
              <Combobox.Option key={_.get(option, valueKey)} value={option} as={Fragment}>
                {({ active, selected }) => (
                  <li className={`relative flex items-center gap-2 rounded-lg`}>
                    <ListItem isOption={true} active={active} selected={selected} item={option} />
                    <div className="absolute right-2 flex h-full flex-col justify-center empty:hidden">
                      <CheckIcon
                        className={classNames(
                          'h-5 w-5 shrink-0 rounded-full bg-blue p-1 text-white',
                          selected ? '' : 'hidden',
                        )}
                      />
                    </div>
                  </li>
                )}
              </Combobox.Option>
            ))}
            {options.length === 0 && <div className="w-full text-gray-400">{NoOptionsMessage}</div>}
          </div>
        </Combobox.Options>
      </Float>
    </Combobox>
  );
}
