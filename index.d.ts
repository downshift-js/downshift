declare namespace Downshift {
    interface Props {
        children: ChildrenFunction;
        defaultHighlightedIndex?: number;
        defaultSelectedItem?: any;
        defaultInputValue?: string;
        defaultIsOpen?: boolean;
        getA11yStatusMessage?: (options: A11StatusMessageOptions) => any;
        itemToString?: (item: any) => string;
        onChange?: (options: ChangeOptions) => void;
        onStateChange?: (options: StateChangeOptions) => void;
        onClick?: Function;
        selectedItem?: any;
        isOpen?: boolean;
        inputValue?: string;
        highlightedIndex?: number;
    }

    interface A11StatusMessageOptions {
        highlightedIndex: number;
        highlightedValue: any;
        inputValue: string;
        isOpen: boolean;
        itemToString: (item: any) => string;
        previousResultCount: number;
        resultCount: number;
        selectedItem: any;
    }

    interface ChangeOptions {
        selectedItem: any;
        previousItem: any;
    }

    interface StateChangeOptions {
        highlightedIndex: number;
        inputValue: string;
        isOpen: boolean;
        selectedItem: any;
    }

    interface GetRootPropsOptions {
        refKey: string;
    }

    interface GetInputPropsOptions extends React.HTMLProps<HTMLInputElement> { }

    interface GetLabelPropsOptions extends React.HTMLProps<HTMLLabelElement> { }

    interface GetButtonPropsOptions extends React.HTMLProps<HTMLButtonElement> {
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

    interface GetItemPropsOptions {
        index: number;
        item: any;
    }

    interface ControllerStateAndHelpers {
        // prop getters
        getRootProps: (options: GetRootPropsOptions) => any;
        getButtonProps: (options: GetButtonPropsOptions) => any;
        getLabelProps: (options: GetLabelPropsOptions) => any;
        getInputProps: (options: GetInputPropsOptions) => any;
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

    type ChildrenFunction = (options: ControllerStateAndHelpers) => React.ReactNode;
    interface Downshift extends React.ComponentClass<Downshift.Props> { }
}

declare module 'downshift' {
    const Downshift: Downshift.Downshift;
    export default Downshift;
}