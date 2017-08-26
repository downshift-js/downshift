import * as React from 'react';

export interface DownshiftProps {
    children: ChildrenFunction;
    defaultHighlightedIndex?: number;
    defaultSelectedItem?: any;
    defaultInputValue?: string;
    defaultIsOpen?: boolean;
    getA11yStatusMessage?: (options: A11StatusMessageOptions) => any;
    itemToString?: (item: any) => string;
    onChange?: (selectedItem: any, allState: any) => void;
    onStateChange?: (options: StateChangeOptions, allState: any) => void;
    onClick?: Function;
    selectedItem?: any;
    isOpen?: boolean;
    inputValue?: string;
    highlightedIndex?: number;
}

export interface A11StatusMessageOptions {
    highlightedIndex: number;
    highlightedValue: any;
    inputValue: string;
    isOpen: boolean;
    itemToString: (item: any) => string;
    previousResultCount: number;
    resultCount: number;
    selectedItem: any;
}

export interface ChangeOptions {
    selectedItem: any;
    previousItem: any;
}

export interface StateChangeOptions {
    highlightedIndex: number;
    inputValue: string;
    isOpen: boolean;
    selectedItem: any;
}

export interface GetRootPropsOptions {
    refKey: string;
}

export interface GetInputPropsOptions extends React.HTMLProps<HTMLInputElement> { }

export interface GetLabelPropsOptions extends React.HTMLProps<HTMLLabelElement> { }

export interface GetButtonPropsOptions extends React.HTMLProps<HTMLButtonElement> {
    // actions
    clearSelection: () => void;
    closeMenu: () => void;
    openMenu: () => void;
    selectHighlightedItem: () => void;
    selectItem: (item: any) => void;
    selectItemAtIndex: (index: number) => void;
    setHighlightedIndex: (index: number) => void;
    toggleMenu: (state: boolean) => void;

    // state
    highlightedIndex: number;
    inputValue: string;
    isOpen: boolean;
    selectedItem: any;
}

interface OptionalExtraGetItemPropsOptions {
    [key: string]: any;
}

export interface GetItemPropsOptions extends OptionalExtraGetItemPropsOptions {
    index: number;
    item: any;
}

export interface ControllerStateAndHelpers {
    // prop getters
    getRootProps: (options: GetRootPropsOptions) => any;
    getButtonProps: (options?: GetButtonPropsOptions) => any;
    getLabelProps: (options?: GetLabelPropsOptions) => any;
    getInputProps: (options?: GetInputPropsOptions) => any;
    getItemProps: (options: GetItemPropsOptions) => any;

    // actions
    openMenu: () => void;
    closeMenu: () => void;
    toggleMenu: () => void;
    selectItem: (item: any) => void;
    selectItemAtIndex: (index: number) => void;
    selectHighlightedItem: (index: number) => void;
    setHighlightedItem: (index: number) => void;
    clearSelection: () => void;

    // state
    highlightedIndex: number;
    inputValue: string;
    isOpen: boolean;
    selectedItem: any;
}

export type ChildrenFunction = (options: ControllerStateAndHelpers) => React.ReactNode;
export type DownshiftInterface = React.ComponentClass<DownshiftProps>;

declare const Downshift: DownshiftInterface;
export default Downshift;
