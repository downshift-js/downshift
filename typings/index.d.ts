// Type definitions for downshift 1.2.0
import * as React from 'react';

type CB = () => void

export interface DownshiftProps {
    children: ChildrenFunction;
    defaultHighlightedIndex?: number | null;
    defaultSelectedItem?: any;
    defaultInputValue?: string;
    defaultIsOpen?: boolean;
    getA11yStatusMessage?: (options: A11StatusMessageOptions) => any;
    itemToString?: (item: any) => string;
    onChange?: (selectedItem: any, stateAndHelpers: ControllerStateAndHelpers) => void;
    onStateChange?: (changes: StateChangeOptions, stateAndHelpers: ControllerStateAndHelpers) => void;
    onUserAction?: (options: StateChangeOptions, stateAndHelpers: ControllerStateAndHelpers) => void;
    onClick?: Function;
    itemCount?: number;
    selectedItem?: any;
    isOpen?: boolean;
    inputValue?: string;
    highlightedIndex?: number;
}

export interface A11StatusMessageOptions {
    highlightedIndex: number | null;
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
    openMenu: (cb: CB) => void;
    closeMenu: (cb: CB) => void;
    toggleMenu: (cb: CB) => void;
    selectItem: (item: any, otherStateToSet: any, cb: CB) => void;
    selectItemAtIndex: (index: number, otherStateToSet: any, cb: CB) => void;
    selectHighlightedItem: (otherStateToSet: any, cb: CB) => void;
    setHighlightedItem: (index: number, otherStateToSet: any, cb: CB) => void;
    clearSelection: (cb: CB) => void;
    reset: (otherStateToSet: any, cb: CB) => void;
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
