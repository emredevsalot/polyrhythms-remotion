import {
	AbsoluteFill,
	Audio,
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

const ballAmount = 1;
const maxLoops = Math.max(ballAmount, 60); // Maximum loop amount the fastest element will make until realignment.
const realignDuration = 7200; // Total time for all dots to realign at the starting point //TODO: start at contact point to have sound at realignment

const useBounceY = (
	frame: number,
	height: number,
	circleRadius: number,
	oneLoopDuration: number
): {translateY: number} => {
	const translateY = interpolate(
		frame % oneLoopDuration,
		[0, oneLoopDuration / 2, oneLoopDuration / 2 + 1, oneLoopDuration],
		[0, height - circleRadius * 2, height - circleRadius * 2, 0],
		{
			// easing: Easing.bezier(0.1, 0.3, 0.3, 0.1),
		}
	);
	return {translateY};
};

export const Poly: React.FC<z.infer<typeof PolySchema>> = ({
	circleRadius: circleRadius,
}) => {
	const {height} = useVideoConfig();
	const frame = useCurrentFrame();

	const balls = [];
	for (let i = 0; i < ballAmount; i++) {
		const numberOfLoops = maxLoops - i;
		const oneLoopDuration = realignDuration / numberOfLoops;

		const {translateY} = useBounceY(
			frame,
			height,
			circleRadius,
			oneLoopDuration
		);
		balls.push(
			<div className="flex" key={i}>
				<div className="bg-black">
					<Circle
						radius={circleRadius}
						fill="white"
						style={{
							// opacity: `${translateY / 720}`,
							transform: `translateY(${translateY}px)`,
						}}
					/>
				</div>
				<Sequence from={oneLoopDuration / 2}>
					<Loop durationInFrames={oneLoopDuration}>
						<Audio
							volume={0.02}
							src={staticFile(`key-${i}.wav`)}
							endAt={oneLoopDuration - 10}
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
