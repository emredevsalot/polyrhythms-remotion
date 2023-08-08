import {
	AbsoluteFill,
	Audio,
	Easing,
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
	const useBounceY = (speed: number): number => {
		const jumpingAnimation = Math.cos(frame * speed * 0.05);

		// const duration = 63 / speed;
		// sound at this easing : 63, 63*3, 63*5

		const translateY = interpolate(
			jumpingAnimation,
			[-1, 1],
			[0, height - propOne * 2],
			{
				easing: Easing.bezier(0, 0, 0, 1),
			}
		);
		return translateY;
	};

	return (
		<AbsoluteFill className="bg-gray-100 justify-end">
			<Circle
				radius={propOne}
				fill="black"
				style={{
					// translateX(${useBounceX(1)}px)
					transform: `translateY(-${useBounceY(1)}px)`,
				}}
			/>
			{/* <Audio volume={0.5} src={staticFile('key1.mp3')} /> */}

			{/* <div className="absolute top-0">
				<div>width:{width}</div>
				<div>fps:{fps}</div>
				<div>durationInFrames:{durationInFrames}</div>
			</div> */}
		</AbsoluteFill>
	);
};
