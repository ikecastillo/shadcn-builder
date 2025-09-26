import { renderHook, act } from '@testing-library/react';
import { useFormBuilderStore } from '@/stores/form-builder-store';
import { useHistory } from '@/hooks/use-history';
import { FormComponentModel } from '@/models/FormComponent';

// Mock the store for testing
jest.mock('@/stores/form-builder-store');

describe('useHistory', () => {
  const mockStore = {
    undo: jest.fn(),
    redo: jest.fn(),
    canUndo: jest.fn(),
    canRedo: jest.fn(),
    saveSnapshot: jest.fn(),
    clearHistory: jest.fn(),
    history: {
      snapshots: [],
      currentIndex: -1,
      maxHistorySize: 50
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useFormBuilderStore as jest.Mock).mockReturnValue(mockStore);
  });

  it('should return history methods and state', () => {
    const { result } = renderHook(() => useHistory());

    expect(result.current.undo).toBe(mockStore.undo);
    expect(result.current.redo).toBe(mockStore.redo);
    expect(result.current.saveSnapshot).toBe(mockStore.saveSnapshot);
    expect(result.current.clearHistory).toBe(mockStore.clearHistory);
  });

  it('should call canUndo and canRedo', () => {
    mockStore.canUndo.mockReturnValue(true);
    mockStore.canRedo.mockReturnValue(false);

    const { result } = renderHook(() => useHistory());

    expect(result.current.canUndo).toBe(true);
    expect(result.current.canRedo).toBe(false);
    expect(mockStore.canUndo).toHaveBeenCalled();
    expect(mockStore.canRedo).toHaveBeenCalled();
  });

  it('should return computed properties correctly', () => {
    mockStore.history = {
      snapshots: [
        { components: [], formTitle: 'Form 1', formId: '1', timestamp: 1 },
        { components: [], formTitle: 'Form 2', formId: '2', timestamp: 2 }
      ],
      currentIndex: 1,
      maxHistorySize: 50
    };

    const { result } = renderHook(() => useHistory());

    expect(result.current.historyLength).toBe(2);
    expect(result.current.currentIndex).toBe(1);
    expect(result.current.hasHistory).toBe(true);
    expect(result.current.isAtBeginning).toBe(false);
    expect(result.current.isAtEnd).toBe(true);
  });

  it('should handle empty history', () => {
    mockStore.history = {
      snapshots: [],
      currentIndex: -1,
      maxHistorySize: 50
    };

    const { result } = renderHook(() => useHistory());

    expect(result.current.historyLength).toBe(0);
    expect(result.current.hasHistory).toBe(false);
    expect(result.current.isAtBeginning).toBe(true);
    expect(result.current.isAtEnd).toBe(true);
  });
});
