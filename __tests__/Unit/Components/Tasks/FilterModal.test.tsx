import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { Tab } from '@/interfaces/task.type';
import FilterModal from '@/components/tasks/TaskSearch/FilterModal';

const mockOnSelect = jest.fn();
const mockOnClose = jest.fn();

describe('FilterModal', () => {
    test('renders the modal with correct title and buttons', () => {
        render(
            <FilterModal
                tabs={[Tab.ASSIGNED, Tab.IN_PROGRESS]}
                onSelect={mockOnSelect}
                activeTab={Tab.ASSIGNED}
                onClose={mockOnClose}
            />
        );

        const modalTitle = screen.getByText('Filter');
        expect(modalTitle).toBeInTheDocument();

        const closeButton = screen.getByText('×');
        expect(closeButton).toBeInTheDocument();

        const assignedButton = screen.getByText(/assigned/i);
        expect(assignedButton).toBeInTheDocument();

        const inProgressButton = screen.getByText(/in progress/i);
        expect(inProgressButton).toBeInTheDocument();
    });

    test('calls onSelect and onClose when a status button is clicked', () => {
        render(
            <FilterModal
                tabs={[Tab.ASSIGNED, Tab.IN_PROGRESS]}
                onSelect={mockOnSelect}
                activeTab={Tab.ASSIGNED}
                onClose={mockOnClose}
            />
        );

        const statusButton = screen.getByText(Tab.ASSIGNED);
        fireEvent.click(statusButton);

        expect(mockOnSelect).toBeCalled();
    });

    test('calls onClose when the close button is clicked', () => {
        render(
            <FilterModal
                tabs={[Tab.ASSIGNED, Tab.IN_PROGRESS]}
                onSelect={mockOnSelect}
                activeTab={Tab.ASSIGNED}
                onClose={mockOnClose}
            />
        );

        const closeButton = screen.getByText('×');
        fireEvent.click(closeButton);

        expect(mockOnClose).toBeCalled();
    });

    test('renders the modal with correct active tab', () => {
        render(
            <FilterModal
                tabs={[Tab.ASSIGNED, Tab.IN_PROGRESS]}
                onSelect={mockOnSelect}
                activeTab={Tab.ASSIGNED}
                onClose={mockOnClose}
            />
        );

        const assignedButton = screen.getByText(/assigned/i);
        expect(assignedButton).toHaveClass('status-button-active');

        const inProgressButton = screen.getByText(/in progress/i);
        expect(inProgressButton).not.toHaveClass('status-button-active');
    });
});
