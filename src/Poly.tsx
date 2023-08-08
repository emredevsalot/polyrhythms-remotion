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
	speed: number,
	frame: number,
	height: number,
	circleRadius: number
): {translateY: number; contactTime: number} => {
	const jumpingAnimation = Math.cos(frame * speed * 0.05);

	// Specific for this easing
	const contactTime = 63 / speed;

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

const ballSpeeds = [
	1, 0.97,
	// 1, 0.97, 0.94, 0.91, 0.88, 0.84, 0.81, 0.78, 0.75, 0.72, 0.69, 0.66,
];
const soundDelay = 8;

export const Poly: React.FC<z.infer<typeof PolySchema>> = ({
	circleRadius: circleRadius,
}) => {
	const {height} = useVideoConfig();
	const frame = useCurrentFrame();

	const balls = ballSpeeds.map((speed, index) => {
		const {translateY, contactTime} = useBounceY(
			speed,
			frame,
			height,
			circleRadius
		);

		return (
			<div className="flex">
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
							volume={0.2}
							src={staticFile(`key-${index}.wav`)}
							endAt={contactTime * 2 - soundDelay}
						/>
					</Loop>
				</Sequence>
			</div>
		);
	});

	return (
		<AbsoluteFill className="bg-gray-100 flex">
			<Sequence from={0}>
				<div className="flex justify-evenly w-full">{balls}</div>
			</Sequence>
		</AbsoluteFill>
	);
};
