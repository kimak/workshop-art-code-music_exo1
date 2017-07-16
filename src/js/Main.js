class Main {

	constructor(){
		// create a new scene & renderer
		this.scene = new THREE.Scene()
		this.renderer = new THREE.WebGLRenderer()
		this.renderer.setPixelRatio( window.devicePixelRatio )
		this.renderer.setSize( window.innerWidth, window.innerHeight )
		document.body.appendChild( this.renderer.domElement )

		// create camera
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 1000 )
		this.camera.position.z = 400
		
		// create a cube
		let geometry = new THREE.IcosahedronGeometry(100,2)
		let material = new THREE.MeshBasicMaterial( { color: 0xFF00FF, wireframe:true } )
		this.mesh = new THREE.Mesh( geometry, material )
		this.scene.add( this.mesh )

		window.addEventListener( 'resize', this.onResize, false )

		this.animate()
	}

	// each frame
	animate = () => {
		requestAnimationFrame( this.animate )
		this.mesh.rotation.x += 0.005
		this.mesh.rotation.y += 0.01
		this.renderer.render( this.scene, this.camera )
	}

	// on resize
	resize = () => {
		this.camera.aspect = window.innerWidth / window.innerHeight
		this.camera.updateProjectionMatrix()
		renderer.setSize( window.innerWidth, window.innerHeight )
	}

}

export default new Main()
