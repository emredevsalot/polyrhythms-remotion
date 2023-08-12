import {Composition} from 'remotion';
import './style.css';
import {PurpleBalls, PurpleBallsSchema} from './compositions/PurpleBalls';

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
			{/* <Composition
				id="OrangeBalls"
				component={OrangeBalls}
				durationInFrames={15 * 60 * 30}
				fps={30}
				width={1280}
				height={720}
				schema={OrangeBallsSchema}
				defaultProps={{
					circleRadius: 36,
					numberOfBalls: 10,
					realignDuration: 7200,
				}}
			/> */}
			<Composition
				id="PurpleBalls"
				component={PurpleBalls}
				durationInFrames={4 * 60 * 30}
				fps={30}
				width={1280}
				height={720}
				schema={PurpleBallsSchema}
				defaultProps={{
					circleRadius: 15,
					numberOfBalls: 15,
					realignDuration: 7200,
					scale: 1,
					visualEffectsAreOn: false,
				}}
			/>
		</>
	);
};
