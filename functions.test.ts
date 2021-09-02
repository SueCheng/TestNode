import { add, aquarium, delay, fetchPosts } from './functions';
import axios from 'axios';

const mockPosts = [
  { id: 1, title: 'local json server data', author: 'JohnDoe' },
  { id: 2, title: 'easy to use for testing', author: 'AliceYoung' },
];
/** how to mock modules
 1, automatic mock, call jest.mock('axios');   https://jestjs.io/docs/es6-class-mocks#automatic-mock
   will be hoisted when at compile time to top and make the `import axios from 'axios' an auto mocked version.
 2, manual mock
  . using factory function in jest.mock;
  . using mockImplementation, mockReturnValue, mockResolvedValue, mockRejectedValue later in each test case when needed)
 * */

jest.mock('axios');
// jest.mock('axios', () => {
//   return {
//     __esModule: true, // needed for mock ES6 module
//     default: {
//       // for mocking the default export from axios module
//       get: jest.fn(() =>
//         Promise.resolve({
//           data: mockPosts,
//         })
//       ),
//     },
//   };
// });
const mockedAxios = axios as jest.Mocked<typeof axios>; // to make typescript know the type of this mocked version axios
describe('add function', () => {
  it('should return the sum of a and b', () => {
    expect(add(3, 5)).toBe(8);
  });

  describe('test jest.fn', () => {
    it('should call mockFn and return mocked value', () => {
      const mockFn = jest.fn().mockReturnValue('success');
      const result = mockFn(1, 2, 3);
      //  mockFn.mock attributes contains all the mock information which you could assert later on
      console.log('mockFn.mock:', mockFn.mock);
      mockFn.mockClear(); //https://jestjs.io/docs/mock-function-api#mockfnmockclear
      console.log('after clear, mockFn.mock was replaced:', mockFn.mock);
      console.log('after clear, mockFn still works:', mockFn(1, 2, 3));
      //   expect(mockFn).toBeCalled();
      //   expect(result).toBe('success');
    });

    it('should call async mockFn and return mocked value', async () => {
      const mockFn = jest.fn().mockResolvedValue('success');
      const result = await mockFn(1, 2, 3);
      expect(result).toBe('success');
    });
  });

  describe('test spyOn', () => {
    const spyHasWhale = jest.spyOn(aquarium, 'hasWhale'); //spyHasWhale has same implementation as the real hasWhale, and could be tracked by Jest
    const result = aquarium.hasWhale();
    expect(spyHasWhale).toHaveBeenCalled();
    expect(result).toBe(true);
    spyHasWhale.mockRestore();
  });

  it('should return proper posts', async () => {
    mockedAxios.get.mockResolvedValue({ data: mockPosts });
    const posts = await fetchPosts();
    expect(posts).toEqual(mockPosts); //toBe is for reference equal, don't use for object compare
    // expect(posts).toMatchSnapshot(); // can be an optional one for big chunk data or UI
    expect(posts).toContainEqual(mockPosts[0]);
  });

  it('should throw error', async () => {
    mockedAxios.get.mockRejectedValue('async error');
    try {
      await fetchPosts();
    } catch (e) {
      // for non async function to expect error, could wrap it into a function, then assert toThrow()
      expect(e.message).toEqual('Something wrong when fetching posts!');
    }
  });

  it('should execute after 5 seconds', () => {
    jest.useFakeTimers();
    const doSomething = jest.fn();
    delay(5000, doSomething);
    jest.advanceTimersByTime(5000);
    expect(doSomething).toHaveBeenCalled();
  });
});

//https://github.com/SueCheng/TestNode
/**
 * Jest is a test runner which integrated
 * mocking functions
 * snapshot testing
 * DOM manipulation
 * assertion library
 * code coverage
 * etc which demands zero configuration.
 * It is very popular for React and NodeJs unit and integration test.
 * */

/** When writing unit test,
 *  1, make test implementation unrelated.
 *  2, make each test case self independent.
 * */

/** mock function and module, snapshot test, please refer above code */

/** jest hooks:
 * beforeEach(usually used to call jest.clearMocks, resetCache to make mockFn in each test start from a brand new state)
 * beforeAll
 * afterEach
 * afterAll
 */

/** what to do if test fail: 
1, it/describe .only, .skip + console.log; 
2, new debug profile in vscode to setup launch.json(rarely used)
* */

/** React Test with Typescript support, have a couple of ways to setup, take our monorepo as example. 
 * We use RTL to offer
 * react rendering
 * user operation simulate
 * DOM assertion. 
 * example https://testing-library.com/docs/react-testing-library/example-intro/

/** Advanced configuration(transform,testEnvironment,testRegex,setupFilesAfterEnv,moduleNameMapper) in jest.config.js, please refer Jest doc
learn more https://blog.logrocket.com/comparing-react-testing-libraries/
* */
