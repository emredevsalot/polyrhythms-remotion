import {interpolate, Easing} from 'remotion';

export const useBounceLinear = (
	frame: number,
	height: number,
	circleRadius: number,
	maxLoops: number,
	oneLoopDuration: number
): {translateY: number} => {
	const translateY = interpolate(
		frame % oneLoopDuration,
		[0, oneLoopDuration / 2, oneLoopDuration / 2 + 1, oneLoopDuration],
		[height - circleRadius * 2, 0, 0, height - circleRadius * 2],
		// [0, height - circleRadius * 2, height - circleRadius * 2, 0], // Start from top
		{
			// easing: Easing.bezier(0.1, 0.3, 0.3, 0.1),
		}
	);
	return {translateY};
};

export const useBounceCos = (
	frame: number,
	height: number,
	circleRadius: number,
	maxLoops: number,
	oneLoopDuration: number
): {translateY: number} => {
	const jumpingAnimation = Math.cos(
		frame * (Math.PI / 30) * (maxLoops / oneLoopDuration)
	);

	const translateY = interpolate(
		jumpingAnimation,
		[-1, 1],
		[0, height - circleRadius * 2],
		{
			easing: Easing.bezier(0, 0, 1, 0),
			// easing: Easing.bezier(0.1, 0.3, 0.3, 0.1),
		}
	);
	return {translateY};
};
