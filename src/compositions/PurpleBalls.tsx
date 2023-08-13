import {AbsoluteFill, Sequence} from 'remotion';

import {z} from 'zod';
import Balls from '../elements/Balls';

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

	return (
		<AbsoluteFill className="bg-[rgb(35,0,50)] flex">
			<Sequence from={0}>
				<div className="flex justify-evenly w-full">
					<Balls
						soundDelay={soundDelay}
						maxLoops={maxLoops}
						visualEffectsAreOn={visualEffectsAreOn}
						numberOfBalls={numberOfBalls}
						realignDuration={realignDuration}
						circleRadius={circleRadius}
						scale={scale}
					/>
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
