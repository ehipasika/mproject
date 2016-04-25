/// <reference path="verletstickintegration.ts"/>

class VerletCubeIntegration extends VerletStickIntegration {

	protected createParticles() {

		// top
		this.AddParticleSimplified(-2, 0, 4, 5);		// note: 5 is x initial velocity
		this.AddParticleSimplified(0, 0, 4, 0, -3);		// note: -3 is y initial velocity
		this.AddParticleSimplified(0, -2, 4, 0);
		this.AddParticleSimplified(-2, -2, 4, 0);

		// bottom
		this.AddParticleSimplified(-2, 0, 2, 0);
		this.AddParticleSimplified(0, 0, 2, 0);
		this.AddParticleSimplified(0, -2, 2, 0);
		this.AddParticleSimplified(-2, -2, 2, 0);
	}

	protected createSticks() {

		// top
		this.addStickSimplified(0, 1);
		this.addStickSimplified(1, 2);
		this.addStickSimplified(2, 3);
		this.addStickSimplified(3, 0);

		// sides (front, back, left, right)
		this.addStickSimplified(0, 4);
		this.addStickSimplified(1, 5);
		this.addStickSimplified(2, 6);
		this.addStickSimplified(3, 7);

		// bottom
		this.addStickSimplified(4, 5);
		this.addStickSimplified(5, 6);
		this.addStickSimplified(6, 7);
		this.addStickSimplified(7, 4);

		// diagonal stabalizers on planes
		this.addStickSimplified(0, 2);	// top
		this.addStickSimplified(4, 6);	// bottom
		this.addStickSimplified(3, 6);	// front
		this.addStickSimplified(0, 5);	// back
		this.addStickSimplified(0, 7);	// left
		this.addStickSimplified(1, 6);	// right

		// diagonals stabalizers
		this.addStickSimplified(0, 6);	
		this.addStickSimplified(1, 7);	
		this.addStickSimplified(2, 4);	
		this.addStickSimplified(3, 5);	
	}

}