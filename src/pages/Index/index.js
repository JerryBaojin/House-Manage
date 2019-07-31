import React from 'react';
import styles from './index.less';
import '@/assets/js/jquery.js';
import '@/assets/js/lrtk.js';
export default function Index(){
    return (
    <div>
    <div className={styles.topbar}>
		<div className={styles.topbar_c}> 
			<div className={styles.logo}></div>
			<div className={styles.login}><a target="_blank" href="login.html">立即使用</a></div>
		</div>	
	</div>
	<div className={styles.slide_main} id="touchMain">
		<a className={styles.prev} href="javascript:;" stat="prev1001"></a>
		<div className={styles.slideBox} id="slideContent">
			<div className={styles.slide} id="bgstylec">
					<div className={styles.obj_e}></div>
					<div className={styles.obj_f}></div>
					<div className={styles.obj_g}></div>
			</div>
			<div className={styles.slide} id="bgstylea">
					<div className={styles.obj_a}></div>
					<div className={styles.obj_b}></div>
					<div className={styles.obj_c}></div>
			</div>
		</div>
		<a className={styles.next} href="javascript:;" stat="next1002"></a>
		<div className={styles.item}>
			<a className={styles.cur} stat="item1001" href="javascript:;"></a><a href="javascript:;" stat="item1002"></a>
		</div>
	</div> 


	<div className={styles.main_1}>
		<div className={styles.main_1_1200}>
			<div className={styles.main_1_1}>
				<div className={styles.ico_1}></div>
				<div className={styles.txt_1}>
					<div className={styles.txt_b}>房源管理</div>
					<div className={styles.txt_c}>自持房、收租房统一管理房源信息一目了然</div>
				</div>
			</div>
			<div className={styles.main_1_2}>
				<div className={styles.ico_2}></div>
				<div className={styles.txt_1}>
					<div className={styles.txt_b}>租赁管理</div>
					<div className={styles.txt_c}>高效便捷的租赁管理让你得心应手</div>
				</div>
			</div>	
			<div className={styles.main_1_3}>
				<div className={styles.ico_3}></div>
				<div className={styles.txt_1}>
					<div className={styles.txt_b}>财务管理</div>
					<div className={styles.txt_c}>日常支出(收入)随时添加，报表一键生成</div>
				</div>
			</div>	
			<div className={styles.main_1_4}>
				<div className={styles.ico_4}></div>
				<div className={styles.txt_1}>
					<div className={styles.txt_b}>运营分析</div>
					<div className={styles.txt_c}>各种数据精准分析，运营状况一目了然</div>
				</div>
			</div>
		</div>
	</div>


	<div className={styles.bigbt}>
		<a target="_blank" href="login.html">&nbsp;&nbsp;立即免费使用</a><sup>&nbsp;v1.0</sup>	
	</div>
	
	<div className={styles.main_2}>
		<div className={styles.main_2_1}>
			<div className={styles.m2_ico_1}></div>
			<div className={styles.m2_t_1}>智能集成</div>
			<div className={styles.m2_t_2}>集成主流智能门锁、智能电（水）表，可在线设置查看相关数据。<br/><font>*此功能将于V2.0版本上线。</font></div>
		</div>
		<div className={styles.main_2_2}>
			<div className={styles.m2_ico_2}></div>
			<div className={styles.m2_t_1}>微信通知</div>
			<div className={styles.m2_t_2}>房租到期可通过微信、短信通知租客，费用明细一目了然。<br/><font>*此功能将于V2.0版本上线。</font></div>
		</div>
		<div className={styles.main_2_3}>
			<div className={styles.m2_ico_3}></div>
			<div className={styles.m2_t_1}>在线工单</div>
			<div className={styles.m2_t_2}>租客登录系统，可在线提交服务工单，服务进度实时跟进。<br/><font>*此功能将于V2.0版本上线。</font></div>
		</div>
		<div className={styles.main_2_4}>
			<div className={styles.m2_ico_4}></div>
			<div className={styles.m2_t_1}>手机APP</div>
			<div className={styles.m2_t_2}>可通过手机APP进行日常管理，随时随地查看相关信息。<br/><font>*此功能将于V3.0版本上线。</font></div>
		</div>
	</div>
	<div className={styles.tencent}></div>
	<div className={styles.bottom}>蜀ICP备19014110号-2   &copy; 2019 屹宇科技</div>
    </div>
    )
}
