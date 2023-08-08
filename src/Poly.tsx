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

export const Poly: React.FC<z.infer<typeof PolySchema>> = ({
	circleRadius: propOne,
}) => {
	const {width, height, fps, durationInFrames} = useVideoConfig();
	const frame = useCurrentFrame();

	const useBounceX = (speed: number): number => {
		const jumpingAnimation = Math.cos(frame * speed * 0.05);
		const translateX = interpolate(
			jumpingAnimation,
			[-1, 1],
			[0, width - propOne * 2],
			{
				easing: Easing.bezier(0, 0, 0, 1),
			}
		);
		return translateX;
	};
	const useBounceY = (
		speed: number
	): {translateY: number; contactTime: number} => {
		const jumpingAnimation = Math.cos(frame * speed * 0.05);

		// Specific for this easing
		const contactTime = 63 / speed;

		const translateY = interpolate(
			jumpingAnimation,
			[-1, 1],
			[0, height - propOne * 2],
			{
				easing: Easing.bezier(0, 0, 0, 1),
			}
		);
		return {translateY, contactTime};
	};

	const {translateY, contactTime} = useBounceY(1);
	const soundDelay = 8;

	return (
		<AbsoluteFill className="bg-gray-100 justify-end">
			<Circle
				radius={propOne}
				fill="black"
				style={{
					// translateX(${useBounceX(1)}px)
					transform: `translateY(-${translateY}px)`,
				}}
			/>
			<Sequence from={contactTime - soundDelay}>
				<Loop durationInFrames={contactTime * 2}>
					<Audio
						volume={0.2}
						src={staticFile('key-6.wav')}
						// startFrom={0}
						endAt={contactTime * 2 - soundDelay}
					/>
				</Loop>
			</Sequence>

			{/* <div className="absolute top-0">
				<div>width:{width}</div>
				<div>fps:{fps}</div>
				<div>durationInFrames:{durationInFrames}</div>
			</div> */}
		</AbsoluteFill>
	);
};
