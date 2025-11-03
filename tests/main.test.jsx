
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from '../../../src/redux/store';
import AppRouter from '../../../src/routes/AppRouter';
import { ThemeProvider } from '../../../src/context-api/ThemeContext';

// Mock ReactDOM.createRoot
jest.mock('react-dom/client', () => ({
  createRoot: jest.fn().mockReturnValue({
    render: jest.fn(),
  }),
}));

describe('main.jsx', () => {
  it('should render the application without crashing', () => {
    const rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);

    // Import main.jsx to trigger the render call
    require('../../../src/main.jsx');

    // Check if createRoot was called with the #root element
    expect(ReactDOM.createRoot).toHaveBeenCalledWith(rootElement);

    // Check if render was called with the correct component tree
    const renderCall = ReactDOM.createRoot().render.mock.calls[0][0];
    expect(renderCall.type).toBe(React.StrictMode);
    expect(renderCall.props.children.type).toBe(Provider);
    expect(renderCall.props.children.props.store).toBe(store);
    expect(renderCall.props.children.props.children.type).toBe(ThemeProvider);
    expect(renderCall.props.children.props.children.props.children.type).toBe(AppRouter);

    document.body.removeChild(rootElement);
  });
});
