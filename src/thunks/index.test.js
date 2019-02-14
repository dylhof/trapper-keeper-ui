import { getNotes, postNotes } from './index';
import * as actions from '../actions';
import { fetchCall } from '../utils/api';


describe("getNotes", () => {
  let mockUrl;
  let mockDispatch;

  window.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve('notes'),
      ok: true
    })
  );

  beforeEach(() => {
    mockDispatch = jest.fn();
  });

  it("calls dispatch with setLoading", () => {
    const thunk = getNotes();
    thunk(mockDispatch);
    expect(mockDispatch).toHaveBeenCalledWith(actions.setLoading(true));
  });

  it('should dispatch setLoading(false) and addAllNotes(notes) if the response is ok', async () => {
    const thunk = getNotes();
    await thunk(mockDispatch);
    expect(mockDispatch).toHaveBeenCalledWith(actions.setLoading(false));
    expect(mockDispatch).toHaveBeenCalledWith(actions.addAllNotes('notes'));
  });

  // ask about undefined status text
  it('should dispatch setError with an error message if the response is not ok', async () => {
    window.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      statusText: 'Error fetching, code: undefined',
      ok: false
    }))
    const thunk = getNotes();
    await thunk(mockDispatch);
    expect(mockDispatch).toHaveBeenCalledWith(actions.setError('Error fetching, code: undefined'));
  });
});