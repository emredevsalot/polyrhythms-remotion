import {
	AbsoluteFill,
	Audio,
	Sequence,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Circle} from '@remotion/shapes';

import {z} from 'zod';
import {useBounceCos} from './hooks';

export const OrangeBallsSchema = z.object({
	circleRadius: z.number(),
	numberOfBalls: z.number(),
	realignDuration: z.number(),
});

export const OrangeBalls: React.FC<z.infer<typeof OrangeBallsSchema>> = ({
	circleRadius: circleRadius,
	numberOfBalls: numberOfBalls,
	realignDuration: realignDuration, // Total time for all dots to realign at the starting point
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

		balls.push(
			<div className="flex" key={i}>
				<div
					className={
						// isGoingDown() ? 'bg-red-600' : 'bg-blue-600'
						'bg-orange-700'
					}
				>
					<div
						className="h-full"
						style={{
							backgroundColor: `rgba(220,220,10, ${getNormalizedY('up')})`,
						}}
					>
						<Circle
							radius={dynamicRadius}
							fill="#c2410c"
							style={{
								// opacity: `${translateY / height}`,
								transform: `translateY(${translateY}px)`,
							}}
						/>
						{/* <Rect
							width={dynamicRadius * 2}
							height={dynamicRadius * 2}
							fill="#c2410c"
							style={{
								// opacity: `${translateY / height}`,
								transform: `translateY(${translateY}px)`,
							}}
						/> */}
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
		<AbsoluteFill className="bg-black flex">
			<Sequence from={0}>
				<div className="flex justify-evenly w-full">{balls}</div>
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
