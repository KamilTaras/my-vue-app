
import { shallowMount } from '@vue/test-utils';
import axios from 'axios';
import CodeSnippetPage from '../../src/views/CodeSnippetPage.vue';
import flushPromises from 'flush-promises';

jest.mock('axios');

describe('CodeSnippetPage.vue', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallowMount(CodeSnippetPage, {
      global: {
        mocks: {
          $route: {
            params: { code_snippet_id: '123' }
          }
        }
      }
    });
  });

  it('fetches code snippet and updates data correctly', async () => {
    const mockData = { data: { data: 'mockCodeSnippet', CodeSnippetVersions: [] } };
    axios.get.mockResolvedValue(mockData);
    await wrapper.vm.fetchCodeSnippet();
    await flushPromises();
    expect(wrapper.vm.codeSnippet).toBe('mockCodeSnippet');
  });

  it('submits a comment and clears commentText', async () => {
    const mockResponse = { data: 'mockResponse' };
    axios.post.mockResolvedValue(mockResponse);
    wrapper.setData({ commentText: 'Test comment', lines: [1] });
    await wrapper.vm.submitComment('versionID');
    expect(axios.post).toHaveBeenCalled();
    expect(wrapper.vm.commentText).toBe('');
  });

  it('sets answering to the comment ID', () => {
    wrapper.vm.startAnswering('commentID');
    expect(wrapper.vm.answering).toBe('commentID');
  });

  it('updates lines correctly', () => {
    const mockLines = [1, 2, 3];
    wrapper.vm.getLines(mockLines);
    expect(wrapper.vm.lines).toEqual(mockLines);
  });

  it('converts datetime string to readable format', () => {
    const mockDatetimeStr = '2023-01-01T00:00:00Z';
    const readableDate = wrapper.vm.convertToReadableFormat(mockDatetimeStr);
    expect(readableDate).toMatch(/\w+ \d{1,2}, \d{4}, \d{1,2}:\d{2}:\d{2} (AM|PM)/);
  });
});