import {Composition} from 'remotion';
import './style.css';
import {Poly, PolySchema} from './Poly';

export const RemotionRoot: React.FC = () => {
	return (
		<>
			{/* <Composition
				id="MyComp"
				component={MyComposition}
				durationInFrames={240}
				fps={30}
				width={1280}
				height={720}
				schema={myCompSchema}
				defaultProps={{
					titleText: 'Welcome to Remotion with Tailwind CSS',
					titleColor: '#000000',
					logoColor: '#00bfff',
				}}
			/> */}
			<Composition
				id="Poly"
				component={Poly}
				durationInFrames={15 * 60 * 30}
				fps={30}
				width={1280}
				height={720}
				schema={PolySchema}
				defaultProps={{circleRadius: 36}}
			/>
		</>
	);
};
