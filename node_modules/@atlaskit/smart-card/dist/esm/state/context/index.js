import { useContext, createContext } from 'react';
import { SmartCardProvider } from './provider';
export var SmartCardContext = createContext(undefined);
export function useSmartLinkContext() {
    var context = useContext(SmartCardContext);
    if (!context) {
        throw Error('useSmartCard() must be wrapped in <SmartCardProvider>');
    }
    return context;
}
export { SmartCardProvider };
export default SmartCardContext;
//# sourceMappingURL=index.js.map