import {cleanup} from "@testing-library/react";
import {act, renderHook} from "@testing-library/react-hooks";
import {useQuery} from "../../lib/hooks/useQuery";
import {QueryEngine} from "../../lib/QueryEngine";

const evaluator = QueryEngine.prototype;
const evaluateMock = evaluator.evaluate = jest.fn();
jest.spyOn(evaluator, 'destroy');

describe('useQuery', () => {

  beforeEach(jest.clearAllMocks);
  afterEach(cleanup);

  it('destroys the evaluator after unmounting', () => {
    const { unmount } = renderHook(() => useQuery({ query: '{ name }' }));
    unmount();
    expect(evaluator.destroy).toHaveBeenCalledTimes(1);
  });

  it('resolves a query', () => {
    const { result } = renderHook(() => useQuery({ query: '{ name }' }));
    expect(result.current).toEqual({ loading: true });
    expect(evaluateMock).toHaveBeenCalledTimes(2);
    expect(evaluateMock.mock.calls[0][0]).toEqual({ query: '{ name }' });

    const callback = evaluateMock.mock.calls[0][1];
    act(() => callback({ data: "Ruben", loading: false, error: undefined }));
    expect(result.current).toEqual({ data: "Ruben", loading: false });
  });

  it('returns an error', () => {
    const { result } = renderHook(() => useQuery({ query: '{ name }' }));
    const callback = evaluateMock.mock.calls[0][1];
    act(() => callback({ loading: false, error: new Error('myError') }));
    expect(result.current).toEqual({ loading: false, error: new Error('myError') });
  });

});
