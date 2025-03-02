import moment from 'moment';
import React, { MouseEvent, useState } from 'react';
import { readMoreFormatter } from '@/utils/common';
import { ProgressDetailsData } from '@/types/standup.type';
import LatestProgressUpdateCardPresentation from './LatestProgressUpdateCardPresentation';

type LatestProgressUpdateCardProps = {
    data: ProgressDetailsData;
};

type ProgressUpdateDataToShow = {
    id: string;
    label: string;
    body: string;
    trimmedBody: string;
    shouldReadMoreButtonShow: boolean;
    isReadMoreEnabled: boolean;
};

export default function LatestProgressUpdateCard({
    data,
}: LatestProgressUpdateCardProps) {
    const momentDate = moment(data?.createdAt);
    const dateInAgoFormat = momentDate.fromNow();
    const [isTooltipVisible, setIsTooltipVisible] = useState(false);
    const fullDate = momentDate.format('DD-MM-YY');
    const time = momentDate.format('hh:mmA');
    const tooltipText = `Updated at ${fullDate}, ${time}`;
    const charactersToShow = 70;

    const dataToShow = [
        {
            id: `completed-${data.id}`,
            label: 'Completed:',
            body: data.completed,
            trimmedBody: readMoreFormatter(data.completed, charactersToShow),
            shouldReadMoreButtonShow: data.completed.length > charactersToShow,
            isReadMoreEnabled: false,
        },
        {
            id: `planned-${data.id}`,
            label: 'Planned:',
            body: data.planned,
            trimmedBody: readMoreFormatter(data.planned, charactersToShow),
            shouldReadMoreButtonShow: data.planned.length > charactersToShow,
            isReadMoreEnabled: false,
        },
        {
            id: `blockers-${data.id}`,
            label: 'Blockers:',
            body: data.blockers,
            trimmedBody: readMoreFormatter(data.blockers, charactersToShow),
            shouldReadMoreButtonShow: data.blockers.length > charactersToShow,
            isReadMoreEnabled: false,
        },
    ];

    const [dataToShowState, setDataToShowState] =
        useState<ProgressUpdateDataToShow[]>(dataToShow);

    function onHoverOnDate(e: MouseEvent<HTMLElement>) {
        setIsTooltipVisible(true);
    }

    function onMouseOutOnDate(e: MouseEvent<HTMLElement>) {
        setIsTooltipVisible(false);
    }

    function onMoreOrLessButtonClick(
        e: MouseEvent<HTMLElement>,
        clickedOnData: ProgressUpdateDataToShow
    ) {
        setDataToShowState((prevState) => {
            const newPrevState = prevState.map((datum) => {
                if (datum.id === clickedOnData.id) {
                    datum.isReadMoreEnabled = !datum.isReadMoreEnabled;
                }
                return datum;
            });

            return newPrevState;
        });
    }

    return (
        <LatestProgressUpdateCardPresentation
            dataToShowState={dataToShowState}
            isTooltipVisible={isTooltipVisible}
            tooltipText={tooltipText}
            onMoreOrLessButtonClick={onMoreOrLessButtonClick}
            onHoverOnDate={onHoverOnDate}
            onMouseOutOnDate={onMouseOutOnDate}
            dateInAgoFormat={dateInAgoFormat}
        />
    );
}
