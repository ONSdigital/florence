import Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
// Mock `window.location` with Jest spies
import "jest-location-mock";

Enzyme.configure({ adapter: new Adapter() });
