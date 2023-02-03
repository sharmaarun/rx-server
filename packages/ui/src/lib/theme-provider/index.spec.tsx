import { render } from '@testing-library/react';
import { UIProvider } from "."
import { DefaultTheme } from "../utils"
describe('Theme Provider', () => {
    it('should render successfully', () => {
        const { baseElement } = render(<UIProvider theme={DefaultTheme} />);
        expect(baseElement).toBeTruthy();
    });
});
