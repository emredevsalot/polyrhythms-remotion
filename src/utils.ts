import {useMemo} from 'react';
import {Easing, interpolate} from 'remotion';

export const isGoingDown = (
	frame: number,
	hitFrameVisual: number,
	oneLoopDuration: number
): boolean => {
	return frame > hitFrameVisual + oneLoopDuration / 2 ? true : false;
};

export const getNormalizedY = (
	translateY: number,
	height: number,
	dynamicRadius: number,
	frame: number,
	hitFrameVisual: number,
	oneLoopDuration: number,
	direction: 'up' | 'down' | 'both'
): number => {
	const y = 1 - translateY / (height - 2 * dynamicRadius);

	switch (direction) {
		case 'down':
			if (isGoingDown(frame, hitFrameVisual, oneLoopDuration) && y > 0.001)
				return y;
			return 1;
		case 'up':
			if (!isGoingDown(frame, hitFrameVisual, oneLoopDuration) && y > 0.001)
				return y;
			return 1;
		case 'both':
			return y;
		default:
			break;
	}

	throw new Error('Invalid direction');
};

export const getDropShadowFilter = (
	visualEffectsAreOn: boolean,
	translateY: number,
	height: number
): Object => {
	if (visualEffectsAreOn) {
		return {
			filter: `drop-shadow(0 0 28px rgba(255, 10, 10, ${translateY / height}))`,
		};
	}
	return {filter: ''};
};

export const getStaticBallValues = (
	maxLoops: number,
	ballIndex: number,
	realignDuration: number,
	circleRadius: number,
	scale: number,
	numberOfBalls: number,
	height: number
): {
	oneLoopDuration: number;
	scaledRadius: number;
} =>
	useMemo(() => {
		const numberOfLoops = maxLoops - ballIndex;
		const oneLoopDuration = realignDuration / numberOfLoops;
		const scaledRadius = circleRadius * (1 + ballIndex * (scale - 1));
		return {oneLoopDuration, scaledRadius};
	}, [numberOfBalls, maxLoops, realignDuration, circleRadius, scale, height]);

export const getDynamicBallValues = (
	frame: number,
	maxLoops: number,
	oneLoopDuration: number,
	dynamicRadius: number,
	height: number,
	soundDelay: number
): {
	translateY: number;
	hitFrameAudio: number;
	normalizedY: number;
} => {
	const jumpingAnimation = Math.cos(
		frame * (Math.PI / 30) * (maxLoops / oneLoopDuration)
	);
	const translateY = interpolate(
		jumpingAnimation,
		[-1, 1],
		[0, height - dynamicRadius * 2],
		{
			easing: Easing.bezier(0, 0, 1, 0),
			// easing: Easing.bezier(0.1, 0.3, 0.3, 0.1),
		}
	);
	const hitFrameAudio =
		Math.floor((frame + soundDelay) / oneLoopDuration) * oneLoopDuration -
		soundDelay;
	const hitFrameVisual = Math.floor(frame / oneLoopDuration) * oneLoopDuration;
	const normalizedY = getNormalizedY(
		translateY,
		height,
		dynamicRadius,
		frame,
		hitFrameVisual,
		oneLoopDuration,
		'up'
	);

	return {
		translateY,
		hitFrameAudio,
		normalizedY,
	};
};

// Linear translateY
// const translateY = interpolate(
//   frame % oneLoopDuration,
//   [0, oneLoopDuration / 2, oneLoopDuration / 2 + 1, oneLoopDuration],
//   [height - circleRadius * 2, 0, 0, height - circleRadius * 2],
//   {
//     easing: Easing.bezier(0.1, 0.3, 0.3, 0.1),
//   }
// );
