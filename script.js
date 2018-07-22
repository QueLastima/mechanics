window.onload = function () {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 1, 100);
    const renderer = new THREE.WebGLRenderer();
    const orbitControls = new THREE.OrbitControls(camera);
    orbitControls.autoRotate = true;
    const stats = new Stats();
    stats.showPanel(0);

    //Постановка задачи
    const R = 2;
    const solution = new function () {
        this.c1 = 20000;
        this.c2 = 30000;
        this.c3 = 10000;
        this.R = .2;
        this.t = 0;

        this.m1 = 50;
        this.m2 = 60;
        this.m3 = 40;
        this.m4 = 50;


        this.a11 = .5*(this.m1+this.m2)*Math.pow(this.R,2);
        this.a22 = .5*(this.m3+this.m4)*Math.pow(this.R,2);
        this.c11 = this.c1+this.c2/1.44;
        this.c22 = this.c2/.81 + this.c3;
        this.c12 = (1/(1.2*.9))*this.c2;
        this.D = Math.sqrt(Math.pow(this.a11 * this.c22 + this.a22 * this.c11,2) -4 * this.a11 * this.a22 * (this.c11 * this.c22 - Math.pow(this.c12,2)));
        this.k1 = '' + Math.sqrt((this.a11 * this.c22 + this.a22 * this.c11 + this.D)/(2*this.a11*this.a22));
        this.k2 = '' + Math.sqrt((this.a11 * this.c22 + this.a22 * this.c11 - this.D)/(2*this.a11*this.a22));

        this.p1 = -(this.c11 - this.a11*Math.pow(this.k1,2))/this.c12;
        this.p2 = -(this.c11 - this.a11*Math.pow(this.k2,2))/this.c12;

        let self = this;

        this.redraw = function() {
             self.t = 0;
             ctx.clearRect(0,-242,500,500);
             ctx1.clearRect(0,-242,500,500);
        };
    };
    class Construction {
        constructor(geometry,material,x,y,z) {
            this.geometry = geometry;
            this.material = material;
            this.x = x;
            this.y = y;
            this.z = z;
            this.mesh = new THREE.Mesh(geometry,material);
        }
        build(scene,angleX,angleY,angleZ) {
            this.mesh.position.x = this.x;
            this.mesh.position.y = this.y;
            this.mesh.position.z = this.z;
            this.mesh.rotation.x = angleX;
            this.mesh.rotation.y = angleY;
            this.mesh.rotation.z = angleZ;
            scene.add(this.mesh);
        }
    }

    class Moving_parts extends Construction {
        spin(solution,sign,ratio,r) {
            let r1 = 1;
            let r2 = 1;
            if(r !== 1) {
                r1 =  solution.p1;
                r2 =  solution.p2;
            }
            let self = this;
                self.mesh.rotation.x = r1*sign*Math.sin(solution.k1*solution.t)/ratio + r2*sign*Math.sin(solution.k2*solution.t)/ratio;
        }
    }

    renderer.setClearColor(0xEEEEEE);
    renderer.setSize(600, 600);
    let main = document.getElementById("main");
    main.appendChild(renderer.domElement);
    renderer.domElement.style.border = "1px solid#000";
    renderer.domElement.style.float = "left";
    renderer.domElement.style.margin = "0 15px 0 0";
    renderer.domElement.style.display = "inline-block";
    main.appendChild(stats.dom);
    stats.dom.style.margin = "16px";

    let p = document.createElement("p");
    p.innerText="Колебания по координате φ";
    main.appendChild(p);

    let cnv = document.createElement("canvas");
    cnv.width = 450;
    cnv.height = 242;
    cnv.setAttribute("id","cnv");
    cnv.style.border = "1px solid#000";
    cnv.style.margin = "0 0 10px 0px";
    main.appendChild(cnv);
    cnv = document.getElementById("cnv");
    const ctx = cnv.getContext("2d");
    ctx.translate(0,141);

    p = document.createElement("p");
    p.innerText="Колебания по координате ψ";
    main.appendChild(p);

    let cnv1 = document.createElement("canvas");
    cnv1.width = 450;
    cnv1.height = 242;
    cnv1.setAttribute("id","cnv1");
    cnv1.style.border = "1px solid#000";
    cnv1.style.margin = "0 0 10px 0px";
    main.appendChild(cnv1);
    cnv1 = document.getElementById("cnv1");
    const ctx1 = cnv1.getContext("2d");
    ctx1.translate(0,141);

    const spotLight = new THREE.SpotLight( 0xffffff );
    spotLight.position.set( 50, 80, 20 );
    scene.add(spotLight);

    const axes = new THREE.AxisHelper( 20 );
    scene.add(axes);

    //Условия задачи
    let wall_1 = new Construction(new THREE.CubeGeometry(10,5,1),new THREE.MeshLambertMaterial({color: 0xff0000,wireframe: false}),0,0,0);
    let shaft_1 = new Construction(new THREE.CylinderGeometry(.5,.5,10,20,10),new THREE.MeshLambertMaterial({color: 0xff0000,wireframe: false}),5.5,0,0);
    let wheel_1 = new Moving_parts(new THREE.CylinderGeometry(2*R,2*R,1,20,5),new THREE.MeshLambertMaterial({color: 0xff0000,wireframe: true}),11,0,0);
    let wheel_2 = new Moving_parts(new THREE.CylinderGeometry(2*R*1.2,2*R*1.2,1,20,5),new THREE.MeshLambertMaterial({color: 0xff0000,wireframe: true}),11,-(2*R+1.2*R*2),0);
    let shaft_2 = new Construction(new THREE.CylinderGeometry(.5,.5,10,20,10),new THREE.MeshLambertMaterial({color: 0xff0000,wireframe: false}),16.5,-(2*R+1.2*R*2),0);
    let wheel_3 = new Moving_parts(new THREE.CylinderGeometry(2*R*.9,2*R*.9,1,20,5),new THREE.MeshLambertMaterial({color: 0xff0000,wireframe: true}),22,-(2*R+1.2*R*2),0);
    let wheel_4 = new Moving_parts(new THREE.CylinderGeometry(2*R,2*R,1,20,5),new THREE.MeshLambertMaterial({color: 0xff0000,wireframe: true}),22,-(2*R+1.2*R*2+.9*R*2+2*R),0);
    let shaft_3 = new Construction(new THREE.CylinderGeometry(.5,.5,5,20,10),new THREE.MeshLambertMaterial({color: 0xff0000,wireframe: false}),19,-(2*R+1.2*R*2+.9*R*2+2*R),0);
    let wall_2 = new Construction(new THREE.CubeGeometry(10,5,1),new THREE.MeshLambertMaterial({color: 0xff0000,wireframe: false}),17,-(2*R+1.2*R*2+.9*R*2+2*R),0);
    wall_1.build(scene,0,Math.PI/2,0);
    shaft_1.build(scene,0,0,Math.PI/2);
    wheel_1.build(scene,0,0,Math.PI/2);
    wheel_2.build(scene,0,0,Math.PI/2);
    shaft_2.build(scene,0,0,Math.PI/2);
    wheel_3.build(scene,0,0,Math.PI/2);
    wheel_4.build(scene,0,0,Math.PI/2);
    shaft_3.build(scene,0,0,Math.PI/2);
    wall_2.build(scene,0,Math.PI/2,0);

    camera.position.x = 20;
    camera.position.y = 10;
    camera.position.z = 40;
    camera.lookAt(scene.position);
    scene.rotation.y = -.5;
    scene.position.y = 8.5;


    let animate = function () {
        requestAnimationFrame(animate);
        stats.begin();
        stats.end();


        solution.a11 = .5*(solution.m1+solution.m2)*Math.pow(solution.R,2);
        solution.a22 = .5*(solution.m3+solution.m4)*Math.pow(solution.R,2);
        solution.c11 = solution.c1+solution.c2/1.44;
        solution.c22 = solution.c2/.81 + solution.c3;
        solution.c12 = (1/(1.2*.9))*solution.c2;
        solution.D = Math.sqrt(Math.pow(solution.a11 * solution.c22 + solution.a22 * solution.c11,2) -4 * solution.a11 * solution.a22 * (solution.c11 * solution.c22 - Math.pow(solution.c12,2)));
        solution.k1 = '' + Math.sqrt((solution.a11 * solution.c22 + solution.a22 * solution.c11 + solution.D)/(2*solution.a11*solution.a22));
        solution.k2 = '' + Math.sqrt((solution.a11 * solution.c22 + solution.a22 * solution.c11 - solution.D)/(2*solution.a11*solution.a22));


        wheel_1.spin(solution,1,1,1);
        wheel_2.spin(solution,-1,1.2,1);
        wheel_3.spin(solution,-1,.9,0);
        wheel_4.spin(solution,1,1,0);

        ctx.beginPath();
        ctx.moveTo(solution.t - 1,Math.sin(solution.k1*solution.t/1000)*50 + Math.sin(solution.k2*solution.t/1000)*50);
        ctx.lineTo(solution.t,Math.sin(solution.k1*solution.t/1000)*50 + Math.sin(solution.k2*solution.t/1000)*50);
        ctx.stroke();
        ctx.closePath();

        ctx1.beginPath();
        ctx1.moveTo(solution.t - 1,solution.p1*Math.sin(solution.k1*solution.t/1000)*50 - solution.p2*Math.sin(solution.k2*solution.t/1000)*50);
        ctx1.lineTo(solution.t,solution.p1*Math.sin(solution.k1*solution.t/1000)*50 - solution.p2*Math.sin(solution.k2*solution.t/1000)*50);
        ctx1.stroke();
        ctx1.closePath();

        solution.t += .4;
        renderer.render(scene,camera);
    };
    animate();
    const gui = new dat.GUI();
    gui.add(solution, 'm1',20,70).onChange(solution.redraw);
    gui.add(solution, 'm2',20,70).onChange(solution.redraw);
    gui.add(solution, 'm3',20,70).onChange(solution.redraw);
    gui.add(solution, 'm4',20,70).onChange(solution.redraw);
    gui.add(solution, 'c1',0,35000).onChange(solution.redraw);
    gui.add(solution, 'c2',0,35000).onChange(solution.redraw);

    gui.add(solution, 'k1').listen();
    gui.add(solution, 'k2').listen();
    gui.add(solution, 'redraw');
    solution.redraw();
}