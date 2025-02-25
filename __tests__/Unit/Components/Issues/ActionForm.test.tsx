import ActionForm from '@/components/issues/ActionForm';
import { renderWithProviders } from '@/test-utils/renderWithProvider';
import * as tasksApi from '@/app/services/tasksApi';
import { useGetTaskDetailsQuery } from '@/app/services/taskDetailsApi';
import { fireEvent, waitFor } from '@testing-library/react';

jest.mock('@/app/services/taskDetailsApi');
const mockedUseGetAllTasksQuery = useGetTaskDetailsQuery as jest.MockedFunction<
    typeof useGetTaskDetailsQuery
>;

describe('Issues Action Form Component', () => {
    let updateTaskSpy: any;
    beforeEach(() => {
        updateTaskSpy = jest.spyOn(tasksApi, 'useUpdateTaskMutation');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('calls updateTaskMutation on clicking assigned button', async () => {
        const mockedCreateTask = jest.fn();
        const mockedUpdateTask = jest.fn();
        mockedUseGetAllTasksQuery.mockReturnValue({
            data: {},
            isLoading: false,
            isError: false,
            refetch: jest.fn(),
        });
        const screen = renderWithProviders(
            <ActionForm
                taskId="123"
                createTask={mockedCreateTask}
                updateTask={mockedUpdateTask}
                taskAssignee=""
            />
        );

        const submitButton = screen.getByRole('button', {
            name: /Assign Task/i,
        });

        expect(submitButton).toBeInTheDocument();
        await waitFor(() => {
            fireEvent.click(submitButton);
        });

        expect(mockedUpdateTask).toHaveBeenCalled();
    });

    test('Should render form properly', () => {
        const mockedFunction = jest.fn();

        const screen = renderWithProviders(
            <ActionForm
                taskId="123"
                createTask={mockedFunction}
                updateTask={mockedFunction}
                taskAssignee=""
            />
        );
        const submitButton = screen.getByRole('button', {
            name: /Assign Task/i,
        });
        const assigneeLabel = screen.getByTestId('assignee-label');
        const assignee = screen.getByPlaceholderText('Type to search Assignee');
        const endsOn = screen.getByLabelText(/Ends on:/);
        const status = screen.getByLabelText(/Status:/);
        const options = screen.getAllByRole('option');
        expect(submitButton).toBeInTheDocument();
        expect(assigneeLabel).toBeInTheDocument();
        expect(assignee).toBeInTheDocument();
        expect(endsOn).toBeInTheDocument();
        expect(status).toBeInTheDocument();
        expect(options).toHaveLength(14);
    });

    test('changes the state when value is entered', () => {
        const mockedFunction = jest.fn();
        const screen = renderWithProviders(
            <ActionForm
                taskId="123"
                createTask={mockedFunction}
                updateTask={mockedFunction}
                taskAssignee=""
            />
        );
        const assignee = screen.getByPlaceholderText(
            'Type to search Assignee'
        ) as HTMLInputElement;
        const status = screen.getByLabelText(/Status:/) as HTMLSelectElement;
        const options = screen.getAllByRole(
            'option'
        ) as Array<HTMLOptionElement>;
        const endsOn = screen.getByLabelText(/Ends on:/) as HTMLInputElement;

        expect(assignee.value).toBe('');
        expect(status.value).toBe('ASSIGNED');

        fireEvent.change(assignee, { target: { value: 123 } });
        expect(assignee.value).toBe('123');

        fireEvent.change(status, { target: { value: options[2].value } });
        expect(status.value).toBe('IN_PROGRESS');

        fireEvent.change(endsOn, { target: { value: '2020-05-12' } });
        expect(endsOn.value).toBe('2020-05-12');
    });

    test('Should show Suggestion box when username is entered', async () => {
        const mockedFunction = jest.fn();
        const screen = renderWithProviders(
            <ActionForm
                taskId="123"
                createTask={mockedFunction}
                updateTask={mockedFunction}
                taskAssignee="user123"
            />
        );
        const assignee = screen.getByPlaceholderText(
            'Type to search Assignee'
        ) as HTMLInputElement;
        let notFoundTextNode = null;
        fireEvent.change(assignee, { target: { value: 123 } });
        await waitFor(() => {
            screen.findByText('User not found!');
        });
        notFoundTextNode = screen.getByTestId('user_not_found');
        expect(notFoundTextNode).toBeInTheDocument();
    });

    test('Sets the default ends On date to offset 2 days from today.', () => {
        const screen = renderWithProviders(<ActionForm taskId="123" />);
        const endsOn = screen.getByLabelText(/Ends on:/) as HTMLInputElement;

        const today = new Date();
        const calculatedDate = new Date(today);
        calculatedDate.setDate(today.getDate() + 2);
        const offsetDate = `${calculatedDate.getFullYear()}-${(
            calculatedDate.getMonth() + 1
        )
            .toString()
            .padStart(2, '0')}-${calculatedDate
            .getDate()
            .toString()
            .padStart(2, '0')}`;
        expect(endsOn.value).toBe(offsetDate);
    });
});
