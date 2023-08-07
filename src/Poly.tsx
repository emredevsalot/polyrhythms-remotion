import {AbsoluteFill} from 'remotion';
import {z} from 'zod';

export const PolySchema = z.object({});

export const Poly: React.FC<z.infer<typeof PolySchema>> = ({}) => {
	return (
		<AbsoluteFill className="bg-gray-100 items-center justify-center">
			<div className="w-12 h-12 bg-black rounded-full"></div>
		</AbsoluteFill>
	);
};
