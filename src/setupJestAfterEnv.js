import Enzyme from 'enzyme';
import Adapter from '@cfaester/enzyme-adapter-react-18';
// Mock `window.location` with Jest spies
import "jest-location-mock";

Enzyme.configure({ adapter: new Adapter() });
