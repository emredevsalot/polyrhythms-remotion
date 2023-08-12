import {AbsoluteFill, Sequence, useVideoConfig} from 'remotion';

import {z} from 'zod';
import {Fragment} from 'react';
import Ball from '../elements/Ball';

export const PurpleBallsSchema = z.object({
	circleRadius: z.number(),
	numberOfBalls: z.number(),
	realignDuration: z.number(),
	scale: z.number(),
	visualEffectsAreOn: z.boolean(),
});

export const PurpleBalls: React.FC<z.infer<typeof PurpleBallsSchema>> = ({
	circleRadius: circleRadius,
	numberOfBalls: numberOfBalls,
	realignDuration: realignDuration, // Total time for all dots to realign at the starting point
	scale: scale,
	visualEffectsAreOn: visualEffectsAreOn,
}) => {
	const maxLoops = Math.max(numberOfBalls, 60); // Maximum loop amount the fastest element will make until realignment.
	const soundDelay = 3;

	const {height} = useVideoConfig();

	const balls = [];
	// try to change <Ball /> component into <Balls /> in order to decrease useFrame usage from 15 to 1
	for (let i = 0; i < numberOfBalls; i++) {
		const BallComponent = (
			<Ball
				key={i}
				ballIndex={i}
				soundDelay={soundDelay}
				maxLoops={maxLoops}
				height={height}
				visualEffectsAreOn={visualEffectsAreOn}
				numberOfBalls={numberOfBalls}
				realignDuration={realignDuration}
				circleRadius={circleRadius}
				scale={scale}
			/>
		);

		balls.push(
			<div className="flex" key={i}>
				{BallComponent}
			</div>
		);
	}

	return (
		<AbsoluteFill className="bg-[rgb(35,0,50)] flex">
			<Sequence from={0}>
				<div className="flex justify-evenly w-full">
					{balls.map((ball, index) => (
						<Fragment key={index}>{ball}</Fragment>
					))}
				</div>
			</Sequence>
		</AbsoluteFill>
	);
};

// delay sound half a loop
// from={
// 	Math.floor(
// 		(frame + soundDelay + oneLoopDuration / 2) / oneLoopDuration
// 	) *
// 		oneLoopDuration -
// 	oneLoopDuration / 2 -
// 	soundDelay
// }
