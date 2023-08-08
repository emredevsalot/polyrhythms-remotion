import {
	AbsoluteFill,
	Audio,
	Easing,
	Loop,
	Sequence,
	interpolate,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {Circle} from '@remotion/shapes';

import {z} from 'zod';

export const PolySchema = z.object({
	circleRadius: z.number(),
});

const useBounceY = (
	velocity: number,
	frame: number,
	height: number,
	circleRadius: number
): {translateY: number; contactTime: number} => {
	velocity = velocity * 10;
	const jumpingAnimation = Math.cos(frame * velocity * 0.05);

	// Specific for this easing
	const contactTime = 63 / velocity;

	const translateY = interpolate(
		jumpingAnimation,
		[-1, 1],
		[height - circleRadius * 2, 0],
		{
			easing: Easing.bezier(0, 1, 1, 1),
		}
	);
	return {translateY, contactTime};
};

const soundDelay = 8;
const ballAmount = 10;
const maxLoops = Math.max(ballAmount, 40); // Maximum loop amount the fastest element will make. (Must be above ballAmount)
const realignDuration = 600; // Total time for all dots to realign at the starting point(not working: Realigns at the top at 7535 and 15070 instead)

export const Poly: React.FC<z.infer<typeof PolySchema>> = ({
	circleRadius: circleRadius,
}) => {
	const {height} = useVideoConfig();
	const frame = useCurrentFrame();

	const balls = [];
	for (let i = 0; i < ballAmount; i++) {
		const numberOfLoops = maxLoops - i;
		const velocity = numberOfLoops / realignDuration;

		const {translateY, contactTime} = useBounceY(
			velocity,
			frame,
			height,
			circleRadius
		);

		balls.push(
			<div className="flex" key={i}>
				<div className="bg-black">
					<Circle
						radius={circleRadius}
						fill="white"
						style={{
							transform: `translateY(${translateY}px)`,
						}}
					/>
				</div>
				<Sequence from={contactTime}>
					<Loop durationInFrames={contactTime * 2}>
						<Audio
							volume={0.02}
							src={staticFile(`key-${i}.wav`)}
							endAt={contactTime * 2 - soundDelay}
						/>
					</Loop>
				</Sequence>
			</div>
		);
	}

	return (
		<AbsoluteFill className="bg-gray-100 flex">
			<Sequence from={0}>
				<div className="flex justify-evenly w-full">{balls}</div>
			</Sequence>
		</AbsoluteFill>
	);
};
