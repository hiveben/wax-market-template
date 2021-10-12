import React, {useRef, useEffect, useState} from 'react';
import cn from "classnames";
import { gsap } from "gsap";

import ResultCard from "./ResultCard";

function ResultList(props) {
    const results = props['results'];

    const el = useRef();
    const q = gsap.utils.selector(el);

    const [cardCount, setCardCount] = useState(0);
    const [currentIndex, setCurrentIndex] = useState(1);

    useEffect(() => {
        setCardCount(results.length);

        gsap
            .to(q('.result-card'), {
                y: '-50%',
                duration: 0.4,
                stagger: 0.66,
                yoyo: true,
                delay: 1
            });
    }, []);

    const onEnter = ({ currentTarget }) => {
        gsap.to(currentTarget, { scale: 1.03 });
    };
    
    const onLeave = ({ currentTarget }) => {
        gsap.to(currentTarget, { scale: 1 });
    };

    const onCardClick = ({ currentTarget }) => {
        setCurrentIndex(currentIndex + 1)

        // reset animation on last card
        if (currentIndex === cardCount) {
            gsap.to(currentTarget, {
                y: '-300%',
                duration: 0.66,
            });
            gsap.to(q('.result-card'), {
                y: '-50%',
                duration: 0.3,
                stagger: 0.6,
                yoyo: true,
                delay: 0.5
            });

            setCurrentIndex(1)
        } else {
            gsap.to(currentTarget, {
                y: '-300%',
                duration: 0.66,
            });
        }
    };

    return (
        <div className={cn('w-screen h-screen my-auto relative')}>
            <div
                className={cn(
                    'absolute h-screen w-80 top-1/2 left-1/2',
                    'transform',
                    '-translate-y-1/2 inset-y-1/2',
                    '-translate-x-1/2 inset-x-1/2',
                )}
            >
                {
                    <div
                        className={cn('relative w-full h-screen transform -rotate-6')}
                        ref={el}
                    >
                        {
                            results.map((template, index) =>
                                <div className={cn(
                                        'absolute top-1/2 left-0 w-full',
                                        'transform -translate-y-screen',
                                        `rotate-${(index * 2) % 6}`,
                                        'result-card',
                                        'hover:rotate-0 cursor-pointer'
                                    )}
                                    onMouseEnter={onEnter}
                                    onMouseLeave={onLeave}
                                    onClick={(evt) => {
                                        onCardClick(evt);
                                    }}
                                >
                                    <ResultCard
                                        {...props}
                                        index={index}
                                        template={template}
                                        key={index}
                                    />
                                </div>
                            )
                        }
                    </div> }
            </div>
        </div>
    );
}

export default ResultList;
