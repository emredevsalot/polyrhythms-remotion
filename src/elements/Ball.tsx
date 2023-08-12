import {Audio, Sequence, staticFile, useCurrentFrame} from 'remotion';
import {
	getDropShadowFilter,
	getDynamicBallValues,
	getStaticBallValues,
} from '../utils';

interface BallProps {
	ballIndex: number;
	soundDelay: number;
	maxLoops: number;
	height: number;
	visualEffectsAreOn: boolean;
	numberOfBalls: number;
	realignDuration: number;
	circleRadius: number;
	scale: number;
}

const Ball: React.FC<BallProps> = ({
	ballIndex,
	soundDelay,
	maxLoops,
	height,
	visualEffectsAreOn,
	numberOfBalls,
	realignDuration,
	circleRadius,
	scale,
}) => {
	const frame = useCurrentFrame();

	const {oneLoopDuration, scaledRadius} = getStaticBallValues(
		maxLoops,
		ballIndex,
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

	return (
		<div className="flex">
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
					src={staticFile(`key-${ballIndex}.wav`)}
					// endAt={oneLoopDuration - soundDelay}
				/>
			</Sequence>
		</div>
	);
};
export default Ball;
