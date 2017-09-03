import * as React from 'react';

export interface DownshiftProps {
    children: ChildrenFunction;
    defaultHighlightedIndex?: number | null;
    defaultSelectedItem?: any;
    defaultInputValue?: string;
    defaultIsOpen?: boolean;
    getA11yStatusMessage?: (options: A11yStatusMessageOptions) => any;
    itemToString?: (item: any) => string;
    onChange?: (selectedItem: any, stateAndHelpers: ControllerStateAndHelpers) => void;
    onStateChange?: (options: StateChangeOptions, stateAndHelpers: ControllerStateAndHelpers) => void;
    onUserAction?: (options: StateChangeOptions, stateAndHelpers: ControllerStateAndHelpers) => void;
    itemCount?: number;
    selectedItem?: any;
    isOpen?: boolean;
    inputValue?: string;
    highlightedIndex?: number;
}

export interface A11yStatusMessageOptions {
    highlightedIndex: number | null;
    highlightedValue: any;
    inputValue: string;
    isOpen: boolean;
    itemToString: (item: any) => string;
    previousResultCount: number;
    resultCount: number;
    selectedItem: any;
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

export interface GetButtonPropsOptions extends React.HTMLProps<HTMLButtonElement> { }

interface OptionalExtraGetItemPropsOptions {
    [key: string]: any;
}

export interface GetItemPropsOptions extends OptionalExtraGetItemPropsOptions {
    index?: number;
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
    openMenu: (cb?: Function) => void;
    closeMenu: (cb?: Function) => void;
    toggleMenu: (cb?: Function) => void;
    selectItem: (item: any, otherStateToSet?: object, cb?: Function) => void;
    selectItemAtIndex: (index: number, otherStateToSet?: object, cb?: Function) => void;
    selectHighlightedItem: (otherStateToSet?: object, cb?: Function) => void;
    setHighlightedIndex: (index: number, otherStateToSet?: object, cb?: Function) => void;
    clearSelection: (cb?: Function) => void;
    reset: (otherStateToSet?: object, cb?: Function) => void;
    itemToString: (item: any) => void;

    // state
    highlightedIndex: number | null;
    inputValue: string | null;
    isOpen: boolean;
    selectedItem: any;
}

export type ChildrenFunction = (options: ControllerStateAndHelpers) => React.ReactNode;
export type DownshiftInterface = React.ComponentClass<DownshiftProps>;

declare const Downshift: DownshiftInterface;
export default Downshift;
