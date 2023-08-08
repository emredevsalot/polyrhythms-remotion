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
				easing: Easing.bezier(0, 0, 1, 0),
			}
		);
		return {translateY, contactTime};
	};

	const soundDelay = 8;

	const balls = [
		1, 0.97,
		// 1, 0.97, 0.94, 0.91, 0.88, 0.84, 0.81, 0.78, 0.75, 0.72, 0.69, 0.66,
	].map((speed) => {
		return (
			<div className="flex">
				<div className="justify-end bg-black">
					<Circle
						radius={propOne}
						fill="white"
						style={{
							transform: `translateY(${useBounceY(speed).translateY}px)`,
						}}
					/>
				</div>
				<Loop durationInFrames={useBounceY(speed).contactTime * 2}>
					<Audio
						volume={0.2}
						src={staticFile('key-6.wav')}
						// startFrom={0}
						endAt={useBounceY(speed).contactTime * 2 - soundDelay}
					/>
				</Loop>
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
