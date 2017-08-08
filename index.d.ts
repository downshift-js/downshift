import * as React from 'react';

declare namespace Downshift {
    interface AutocompleteProps {
        children: React.ReactNode;
        component?: any;
        defaultSelectedIndex?: string;
        defaultHighlightedIndex?: number;
        getA11yStatusMessage?: Function;
        getValue?: Function;
        innerRef?: Function;
        onChange: (item: any) => void;
    }

    interface ChildrenOptions {
        highlightedIndex?: number;
        setHighlightedIndex?: (index: number) => void;
        inputValue?: string;
        isOpen?: boolean;
        toggleMenu?: (state: boolean) => void;
        openMenu?: () => void;
        closeMenu?: () => void;
        selectedItem: any;
        clearSelection?: () => void;
        selectItem?: (item: any) => void;
        selectItemAtIndex?: (index: number) => void;
        selectHighlightedIndex?: () => void;
    }

    type ChildrenFunction = (options: ChildrenOptions) => void;

    interface InputProps {
        defaultValue?: string;
    }
    class Input extends React.Component<InputProps, {}> {}

    interface ControllerProps {
        children: ChildrenFunction;
    }
    class Controller extends React.Component<ControllerProps, {}> {}

    interface ButtonProps {}
    class Button extends React.Component<ButtonProps, {}> {}

    interface ItemProps {
        index: number;
        value: any;
    }
    class Item extends React.Component<ItemProps, {}> {}
    class Autocomplete extends React.Component<
        Downshift.AutocompleteProps,
        {}
    > {
        public static Button: typeof Downshift.Button;
        public static Controller: typeof Downshift.Controller;
        public static Input: typeof Downshift.Input;
        public static Item: typeof Downshift.Item;
    }
}

export default Downshift.Autocomplete;
