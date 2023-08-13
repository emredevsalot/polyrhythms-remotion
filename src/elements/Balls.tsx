import {
	Audio,
	Sequence,
	staticFile,
	useCurrentFrame,
	useVideoConfig,
} from 'remotion';
import {
	getDropShadowFilter,
	getDynamicBallValues,
	getStaticBallValues,
} from '../utils';

interface BallsProps {
	soundDelay: number;
	maxLoops: number;
	visualEffectsAreOn: boolean;
	numberOfBalls: number;
	realignDuration: number;
	circleRadius: number;
	scale: number;
}

const Balls: React.FC<BallsProps> = ({
	soundDelay,
	maxLoops,
	visualEffectsAreOn,
	numberOfBalls,
	realignDuration,
	circleRadius,
	scale,
}) => {
	const frame = useCurrentFrame();
	const {height} = useVideoConfig();

	const balls = [];
	for (let i = 0; i < numberOfBalls; i++) {
		const {oneLoopDuration, scaledRadius} = getStaticBallValues(
			maxLoops,
			i,
			realignDuration,
			circleRadius,
			scale,
			numberOfBalls,
			height
		);

		const {translateY, hitFrameAudio, normalizedY} = getDynamicBallValues(
			frame,
			maxLoops,
			oneLoopDuration,
			scaledRadius,
			height,
			soundDelay
		);

		balls.push(
			<div key={i} className="flex">
				<div
					className={'bg-black/10'}
					style={{
						...getDropShadowFilter(visualEffectsAreOn, translateY, height),
						display: 'flex',
					}}
				>
					<div
						className="h-full"
						style={{
							...getDropShadowFilter(visualEffectsAreOn, translateY, height),
							background: `linear-gradient(0deg, rgba(245, 158, 11, ${
								1 - normalizedY
							}) 0%, rgba(0, 0, 0, 0) 60%)`,
						}}
					>
						<svg
							height={`${scaledRadius * 2}`}
							width={`${scaledRadius * 2}`}
							className="fill-amber-500"
							style={{
								opacity: `${translateY / height}`,
								transform: `translate3d(0, ${translateY}px, 0)`,
								willChange: 'transform',
							}}
						>
							<circle
								cx={`${scaledRadius}`}
								cy={`${scaledRadius}`}
								r={`${scaledRadius}`}
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
	return balls;
};
export default Balls;
