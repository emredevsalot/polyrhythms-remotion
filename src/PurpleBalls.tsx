import {
	AbsoluteFill,
	Audio,
	Sequence,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';

import {z} from 'zod';
import {useBounceCos} from './hooks';
import {Fragment} from 'react';

export const PurpleBallsSchema = z.object({
	circleRadius: z.number(),
	numberOfBalls: z.number(),
	realignDuration: z.number(),
	visualEffectsAreOn: z.boolean(),
});

export const PurpleBalls: React.FC<z.infer<typeof PurpleBallsSchema>> = ({
	circleRadius: circleRadius,
	numberOfBalls: numberOfBalls,
	realignDuration: realignDuration, // Total time for all dots to realign at the starting point
	visualEffectsAreOn: visualEffectsAreOn,
}) => {
	const maxLoops = Math.max(numberOfBalls, 60); // Maximum loop amount the fastest element will make until realignment.
	const scale = 1;
	const soundDelay = 0;

	const {height} = useVideoConfig();
	const frame = useCurrentFrame();

	const balls = [];
	for (let i = 0; i < numberOfBalls; i++) {
		const numberOfLoops = maxLoops - i;
		const oneLoopDuration = realignDuration / numberOfLoops;
		const dynamicRadius = circleRadius * (1 + i * (scale - 1));

		const {translateY} = useBounceCos(
			frame,
			height,
			dynamicRadius,
			maxLoops,
			oneLoopDuration
		);

		const hitFrameAudio =
			Math.floor((frame + soundDelay) / oneLoopDuration) * oneLoopDuration -
			soundDelay;

		const hitFrameVisual =
			Math.floor(frame / oneLoopDuration) * oneLoopDuration;

		const isGoingDown = () => {
			return frame > hitFrameVisual + oneLoopDuration / 2 ? true : false;
		};

		/**
		 * Calculates the normalized Y value of an object's position based on the provided direction.
		 * @param direction - The direction parameter can be one of three values: 'up', 'down', or 'both'.
		 *                   - 'up': Returns the normalized Y value only while the object is moving upwards.
		 *                   - 'down': Returns the normalized Y value only while the object is moving downwards.
		 *                   - 'both': Returns the normalized Y value regardless of the object's movement direction.
		 * @returns The normalized Y value of the object's position based on the specified direction.
		 * @throws Throws an error if an invalid direction is provided.
		 */
		const getNormalizedY = (direction: 'up' | 'down' | 'both'): number => {
			const y = 1 - translateY / (height - 2 * dynamicRadius);

			switch (direction) {
				case 'down':
					if (isGoingDown() && y > 0.001) return y;
					return 1;
				case 'up':
					if (!isGoingDown() && y > 0.001) return y;
					return 1;
				case 'both':
					return y;
				default:
					break;
			}
			// TypeScript will throw an error if this line is reached, because all cases are handled above
			throw new Error('Invalid direction');
		};

		const getDropShadowFilter = () => {
			if (visualEffectsAreOn) {
				return {
					filter: `drop-shadow(0 0 28px rgba(255, 10, 10, ${
						translateY / height
					}))`,
				};
			}
			return {};
		};

		balls.push(
			<div className="flex" key={i}>
				<div className={'bg-black/10'} style={{...getDropShadowFilter()}}>
					{/* Full height rectangle */}
					<div
						className="h-full"
						style={{
							...getDropShadowFilter(),
							background: `linear-gradient(0deg, rgba(245, 158, 11, ${
								1 - getNormalizedY('up')
							}) 0%, rgba(0, 0, 0, 0) 60%)`,
						}}
					>
						{/* Shape */}
						<svg
							height={`${dynamicRadius * 2}`}
							width={`${dynamicRadius * 2}`}
							className="fill-amber-500"
							style={{
								opacity: `${translateY / height}`,
								transform: `translate3d(0, ${translateY}px, 0)`,
								willChange: 'transform',
							}}
						>
							<circle
								cx={`${dynamicRadius}`}
								cy={`${dynamicRadius}`}
								r={`${dynamicRadius}`}
							/>
						</svg>
					</div>
				</div>
				<Sequence
					name="AudioSeq"
					from={hitFrameAudio}
					durationInFrames={oneLoopDuration - soundDelay}
				>
					<Audio
						volume={0.02}
						src={staticFile(`key-${i}.wav`)}
						// endAt={oneLoopDuration - soundDelay}
					/>
				</Sequence>
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
