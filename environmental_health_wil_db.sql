-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 17, 2025 at 03:01 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `environmental_health_wil_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `access_log`
--

CREATE TABLE `access_log` (
  `log_id` int(11) NOT NULL,
  `accessed_by` int(11) DEFAULT NULL,
  `access_time` timestamp NOT NULL DEFAULT current_timestamp(),
  `document_id` int(11) DEFAULT NULL,
  `action` enum('view','modify') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `activity_logsheet`
--

CREATE TABLE `activity_logsheet` (
  `logsheet_id` int(11) NOT NULL,
  `activity_id` int(11) NOT NULL,
  `hours_logged` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `audit_log`
--

CREATE TABLE `audit_log` (
  `audit_id` int(11) NOT NULL,
  `table_name` varchar(50) DEFAULT NULL,
  `action` varchar(10) DEFAULT NULL,
  `record_id` int(11) DEFAULT NULL,
  `changed_by` int(11) DEFAULT NULL,
  `changed_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `old_value` text DEFAULT NULL,
  `new_value` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `blocked_signups`
--

CREATE TABLE `blocked_signups` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `blocked_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `daily_logsheet`
--

CREATE TABLE `daily_logsheet` (
  `id` int(11) NOT NULL,
  `log_date` date NOT NULL,
  `student_number` varchar(50) NOT NULL,
  `activity1` varchar(255) DEFAULT NULL,
  `hours1` int(11) DEFAULT NULL,
  `activity2` varchar(255) DEFAULT NULL,
  `hours2` int(11) DEFAULT NULL,
  `activity3` varchar(255) DEFAULT NULL,
  `hours3` int(11) DEFAULT NULL,
  `activity4` varchar(255) DEFAULT NULL,
  `hours4` int(11) DEFAULT NULL,
  `activity5` varchar(255) DEFAULT NULL,
  `hours5` int(11) DEFAULT NULL,
  `activity6` varchar(255) DEFAULT NULL,
  `hours6` int(11) DEFAULT NULL,
  `activity7` varchar(255) DEFAULT NULL,
  `hours7` int(11) DEFAULT NULL,
  `activity8` varchar(255) DEFAULT NULL,
  `hours8` int(11) DEFAULT NULL,
  `activity9` varchar(255) DEFAULT NULL,
  `hours9` int(11) DEFAULT NULL,
  `activity10` varchar(255) DEFAULT NULL,
  `hours10` int(11) DEFAULT NULL,
  `activity11` varchar(255) DEFAULT NULL,
  `hours11` int(11) DEFAULT NULL,
  `activity12` varchar(255) DEFAULT NULL,
  `hours12` int(11) DEFAULT NULL,
  `activity13` varchar(255) DEFAULT NULL,
  `hours13` int(11) DEFAULT NULL,
  `activity14` varchar(255) DEFAULT NULL,
  `hours14` int(11) DEFAULT NULL,
  `description` text DEFAULT NULL,
  `situation_description` text DEFAULT NULL,
  `situation_evaluation` text DEFAULT NULL,
  `situation_interpretation` text DEFAULT NULL,
  `student_signature` varchar(255) DEFAULT NULL,
  `mentor_check` varchar(50) NOT NULL DEFAULT 'unChecked',
  `supervisor_signature` varchar(255) DEFAULT NULL,
  `EHP_HI_Number` varchar(256) DEFAULT NULL,
  `date_stamp` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `daily_logsheet`
--

INSERT INTO `daily_logsheet` (`id`, `log_date`, `student_number`, `activity1`, `hours1`, `activity2`, `hours2`, `activity3`, `hours3`, `activity4`, `hours4`, `activity5`, `hours5`, `activity6`, `hours6`, `activity7`, `hours7`, `activity8`, `hours8`, `activity9`, `hours9`, `activity10`, `hours10`, `activity11`, `hours11`, `activity12`, `hours12`, `activity13`, `hours13`, `activity14`, `hours14`, `description`, `situation_description`, `situation_evaluation`, `situation_interpretation`, `student_signature`, `mentor_check`, `supervisor_signature`, `EHP_HI_Number`, `date_stamp`, `created_at`) VALUES
(40, '2025-04-28', '20251111', 'Vector Control Monitoring', 1, 'Chemical Safety', 1, 'Waste Management', 1, 'Food Control', 1, 'Radiation Monitoring and Control', 1, 'Health Surveillance of Premises', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'I conducted a vector control survey around a public hospital and reviewed their safety procedures for chemical handling. I also performed a food safety audit and assisted in ensuring radiation monitoring equipment was calibrated.', 'While conducting the vector control survey, I identified areas with poor waste disposal that could potentially attract rodents. I reported it to the facility management for immediate action.', 'This was significant because improper waste disposal and poor hygiene contribute to vector-borne diseases and contamination in health facilities, which could lead to outbreaks.', 'I learned the importance of preventative measures like regular monitoring and waste disposal in maintaining a clean and safe environment in healthcare settings.', 'sig1.png', 'checked', '1748397934674-235534440-0.png', 'HI- 02154', NULL, '2025-05-28 02:05:34'),
(41, '2025-04-29', '20252222', 'Surveillance & Prevention of Communicable Diseases', 1, 'Port Health', 1, 'Control & Monitoring of Hazardous Substances', 1, 'Disposal of the Dead', 1, 'General Hygiene Monitoring', 1, 'Noise Control', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'I was involved in a survey to assess communicable disease risks at a local airport and seaport, reviewed hygiene practices among staff at a landfill, and monitored noise pollution levels near a hospital.', 'At the seaport, I found that some containers containing hazardous chemicals were improperly stored. There was also a noise issue near a residential area, where loud machinery affected the surrounding community.', 'This situation highlighted the need for stricter control and regulations to ensure that hazardous materials are handled properly and that noise levels are reduced for the safety of the public.', 'I learned about the regulatory frameworks that govern port health and the importance of managing environmental factors like noise and hazardous material storage to reduce health risks.', 'sig2.png', 'unChecked', '1748397949543-45436016-0.png', 'HI- 02154', NULL, '2025-05-28 02:05:49'),
(42, '2025-04-30', '20253333', 'Radiation Monitoring and Control', 1, 'Food Control', 1, 'Waste Management', 1, 'Health Surveillance of Premises', 1, 'Surveillance & Prevention of Communicable Diseases', 1, 'Chemical Safety', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Today, I was responsible for reviewing the radiation levels at an industrial site, and I also conducted food safety checks at a local restaurant. My duties included inspecting waste management practices and conducting health surveillance to ensure public safety.', 'During the food safety inspection, I discovered several food items past their expiration date. I also observed that some chemicals used for cleaning were not labeled properly, which posed a significant safety risk.', 'This was significant because expired food and unmarked cleaning chemicals pose a threat to health and could result in foodborne illnesses or poisoning if consumed or mishandled.', 'I learned that proper labeling, expiration date checks, and staff education are essential to ensure public health safety. I also gained experience in inspecting food facilities for regulatory compliance.', 'sig3.png', 'unChecked', '1748397884736-767498784-0.png', 'HI- 02154', NULL, '2025-05-28 02:04:44'),
(43, '2025-05-01', '21904759', 'Environmental Pollution Control (water & air)', 1, 'Waste Management', 1, 'Health Surveillance of Premises', 1, 'Surveillance & Prevention of Communicable Diseases', 1, 'Chemical Safety', 1, 'Noise Control', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'I worked with the environmental health team to inspect water quality in a nearby river, surveyed waste management systems in an industrial area, and reviewed chemical safety protocols in a nearby chemical plant.', 'I noticed that the waste management facilities near the river were not being maintained properly, which could lead to water contamination. I reported this to the authorities for further action.', 'The situation was significant because poor waste management practices can lead to environmental pollution and health hazards, particularly in regions dependent on natural water sources.', 'I learned how important it is to monitor water quality and enforce environmental regulations to prevent pollution. I also realized the role of the public health sector in ensuring that hazardous materials are safely stored and disposed of.', '21.png', 'unChecked', '1748397968794-147378215-0.png', 'HI- 02154', NULL, '2025-05-28 02:06:08'),
(44, '2025-05-02', '20255555', 'Port Health', 1, 'Chemical Safety', 1, 'Control & Monitoring of Hazardous Substances', 1, 'Food Control', 1, 'Waste Management', 1, 'Radiation Monitoring and Control', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Today, I focused on inspecting a cargo shipment at a port for hazardous materials, and I reviewed food control practices at a local supermarket. My work included ensuring radiation monitoring devices were functioning properly and that waste disposal was managed according to regulations.', 'I found that some shipments had incomplete documentation, and there was a case where waste containers were incorrectly labeled. This could have led to safety hazards had the shipment been allowed entry.', 'This situation highlighted the importance of ensuring that all hazardous materials entering the country are properly documented and labeled to avoid accidents, contamination, or environmental damage.', 'I learned how critical it is to conduct thorough inspections and maintain proper documentation when dealing with hazardous substances to ensure safety and compliance with international regulations.', 'sig5.png', 'unChecked', '1748397871821-795231027-0.png', 'HI- 02154', NULL, '2025-05-28 02:04:31'),
(45, '2025-05-03', '20256666', 'Chemical Safety', 1, 'Radiation Monitoring and Control', 1, 'Health Surveillance of Premises', 1, 'Waste Management', 1, 'Surveillance & Prevention of Communicable Diseases', 1, 'Port Health', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'I was tasked with inspecting radiation levels in a nearby power plant, reviewing chemical safety procedures at a manufacturing facility, and assisting in a public health surveillance program at a local school.', 'While inspecting the power plant, I identified several safety violations related to the handling of hazardous chemicals. I also observed that the school lacked proper waste segregation systems.', 'This was significant because improper chemical handling can lead to severe environmental or health risks, and inadequate waste segregation at schools increases the likelihood of contamination and disease outbreaks.', 'I learned how essential it is to enforce safety regulations and educate the public on proper waste management practices to prevent health risks and ensure compliance with safety standards.', 'sig6.png', 'unChecked', '1748397746862-934582314-0.png', 'HI- 02154', NULL, '2025-05-28 02:02:27'),
(46, '2025-05-04', '20257777', 'Surveillance & Prevention of Communicable Diseases', 1, 'Port Health', 1, 'Waste Management', 1, 'Noise Control', 1, 'Environmental Pollution Control (water & air)', 1, 'Radiation Monitoring and Control', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Today, I assisted in monitoring communicable disease outbreaks at a local hospital, and I helped to ensure that proper waste disposal practices were being followed at a landfill. I also participated in an environmental pollution audit, focusing on air quality and radiation levels.', 'During the hospital surveillance, I found that the hospital staff was not consistently following the recommended protocols for isolation of infected patients. I made suggestions for improvements.', 'The situation was significant because poor infection control practices in a hospital can lead to rapid disease spread, especially in high-risk areas like emergency rooms or intensive care units.', 'I learned the importance of early detection, isolation, and public health measures in preventing disease outbreaks in hospitals and healthcare facilities. I also gained practical experience in environmental monitoring and pollution control.', 'sig7.png', 'unChecked', '1748397726797-159058334-0.png', 'HI- 02154', NULL, '2025-05-28 02:02:06'),
(47, '2025-04-25', '21904759', 'Food Control', 1, 'Waste Management', 1, 'Water Quality Monitoring', 2, 'Vector Control Monitoring', 1, 'Chemical Safety', 2, 'General Hygiene Monitoring', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Today, I was actively involved in inspecting food storage areas and waste bins at a local community clinic. I worked with the team to ensure water quality testing kits were properly calibrated and reviewed chemical safety guidelines with staff.', 'During the waste inspection, I noticed expired food items stored in the same fridge as fresh food. There was also a chemical container stored near the food storage area, which could lead to contamination.', 'This was significant because storing chemicals and expired food improperly can cause health hazards and compromise food safety. Reporting the issue helped the staff take corrective action immediately.', 'I learned the importance of cross-checking expiration dates and segregating chemicals from consumables to prevent health violations and protect public safety.', '21.png', 'unChecked', '1748397810028-495352712-0.png', 'HI- 02154', NULL, '2025-05-28 02:03:30'),
(48, '2025-04-26', '20255555', 'Noise Control', 1, 'Radiation Monitoring and Control', 1, 'Disposal of the Dead', 1, 'Environmental Pollution Control (water & air)', 1, 'Port Health', 1, 'Control & Monitoring of Hazardous Substances', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'I helped measure sound levels around a busy marketplace and inspected a radiation detector at the port. I also assisted in a cemetery site audit regarding safe burial practices.', 'At the port, an incoming shipment of chemicals lacked proper documentation. The noise levels in the nearby residential area were far above the safe threshold during business hours.', 'It was significant because it highlighted lapses in international health and safety compliance, especially involving hazardous substances entering the country.', 'This situation helped me understand the importance of inter-agency coordination at ports and how noise pollution affects residents’ mental and physical health.', 'sig5.png', 'unChecked', '1748397906336-951711891-0.png', 'HI- 02154', NULL, '2025-05-28 02:05:06'),
(49, '2025-04-27', '20251111', 'Health Surveillance of Premises', 1, 'Surveillance & Prevention of Communicable Diseases', 1, 'Waste Management', 1, 'Food Control', 1, 'Chemical Safety', 1, 'General Hygiene Monitoring', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'I was part of the team inspecting a daycare center for hygiene compliance. I examined kitchen conditions, assessed personal hygiene practices of staff, and reviewed chemical usage logs.', 'During inspection, I observed staff not wearing gloves while handling both food and waste. Chemicals were also found unlabelled and within reach of children.', 'This was a serious issue because improper hygiene and unsafe chemical storage in a daycare facility can lead to disease transmission and accidental poisoning.', 'I learned that regular surveillance and immediate reporting can prevent outbreaks in vulnerable populations like children. It also reinforced the role of documentation and compliance.', 'sig1.png', 'unChecked', '1748397919725-850078336-0.png', 'HI- 02154', NULL, '2025-05-28 02:05:19'),
(50, '2025-05-25', '21904759', 'Food Control', 2, 'Monitoring water quality and availability', 2, 'Waste Management', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'I worked the whole day assisting with routine duties and observing workplace procedures.', 'I was assigned to shadow a senior staff member responsible for conducting hygiene inspections in the kitchen. I observed how checklists were used, assisted in identifying non-compliant areas, and documented issues that needed corrective action.', 'This event was significant because it was my first practical exposure to real-time hygiene control procedures. It allowed me to see how theoretical knowledge of food safety is applied in a working environment and why compliance is essential to protect public health.', 'I learned how to conduct hygiene checks, how to spot common hygiene violations, and the importance of documentation. I also gained an understanding of the role of environmental health officers in maintaining safety standards and how effective communication with staff is essential when addressing non-compliance.', '1748175038811-681886043-0.png', 'unChecked', '1748397710363-417481437-0.png', 'HI- 02155', '2025-05-25', '2025-05-29 08:11:54'),
(54, '2025-05-26', '21904759', 'Food Control', 5, 'Monitoring water quality and availability', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Throughout my work-integrated learning (WIL) period, I engaged in various activities such as collaborating with team members on projects, participating in client meetings, preparing reports, and analyzing data to support decision-making processes.', 'One of the most significant events was when I was asked to lead a presentation for a key client. This involved preparing the presentation materials, coordinating with my team, and delivering the content confidently to demonstrate our solutions. It was a critical moment as it tested my communication skills and understanding of the project. ', 'This event was significant because it marked a milestone in my professional development. It provided an opportunity to showcase my ability to handle responsibilities independently, engage with clients effectively, and contribute meaningfully to the team’s objectives. The positive feedback I received also boosted my confidence and reinforced the importance of thorough preparation', 'From this experience, I learned the value of clear communication, diligent preparation, and teamwork. I understood the importance of understanding client needs thoroughly to tailor presentations accordingly. It also taught me to remain calm and composed under pressure, skills that will be valuable in my future career.', '1748259030651-888398298-21.png', 'checked', '1748509511458-462771979-0.png', 'HI-12345', '2025-05-26', '2025-05-29 09:05:11'),
(55, '2025-05-28', '21904759', 'Food Control', 1, 'Monitoring water quality and availability', 1, 'Waste Management', 1, 'General hygiene monitoring', 1, 'Vector control monitoring', 2, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Attended team meeting to brainstorm ideas', 'Team was struggling to find common ground', 'The team is having difficulty collaborating', 'The team may need clearer communication or leadership guidance', '1748395846331-515699202-21.png', 'checked', '1748508988550-453163742-0.png', 'HI-12345', '2025-05-28', '2025-05-29 08:56:28'),
(56, '2025-05-29', '21904759', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Environmental pollution control (water & air)', 1, 'Radiation monitoring and control ', 1, 'Health surveillance of premises', 1, 'Surveillance & prevention of communicable diseases and Malaria control ', 1, NULL, NULL, 'Control & monitoring of hazardous substances', 1, 'Disposal of the dead', 1, 'The most significant event was discovering improperly labeled cleaning chemicals stored near food preparation areas. This posed a contamination risk and was addressed immediately during the inspection.\r\n', 'While inspecting the facility, I noticed several unlabelled spray bottles stored alongside ingredients in the food preparation zone. Upon questioning the staff, they admitted the bottles contained industrial cleaning agents used earlier that morning but were unaware of the proper storage procedures.', 'This was significant because it demonstrated a clear violation of food safety standards and highlighted the potential risk of cross-contamination, which could lead to public health hazards. It also underscored the importance of constant vigilance and thorough inspections in maintaining a safe food environment.\r\n\r\n', 'I learned the importance of not only enforcing compliance but also educating facility staff on best practices and the reasoning behind regulations. I gained practical experience in identifying hazards, communicating risks effectively, and applying theoretical knowledge in a real-world setting.', '1748522764531-476657631-21.png', 'checked', NULL, 'Not Signed', '2025-05-29', '2025-05-29 12:46:04'),
(57, '2025-05-06', '21904759', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Chemical safety', 1, 'Noise control Hour', 1, 'Environmental pollution control (water & air)', 3, NULL, NULL, NULL, NULL, 'Surveillance & prevention of communicable diseases and Malaria control ', 1, NULL, NULL, NULL, NULL, NULL, NULL, 'During the week, I was involved in several WIL activities including food safety inspections, waste management assessments, and public health education sessions. I also participated in site visits with my supervisor to monitor hygiene compliance in local businesses.\r\n\r\n', 'We conducted an unannounced visit to a local takeaway outlet. Upon inspection, we observed improper food storage, lack of temperature control in refrigeration units, and poor employee hygiene practices. I assisted in documenting the findings, issuing a warning notice, and advising on corrective actions.', 'This event was significant because it tested my understanding of environmental health regulations and required me to apply theoretical knowledge in a real-world scenario. It also allowed me to witness the importance of immediate intervention to protect public health.\r\n\r\n', 'I learned how to conduct a professional inspection under pressure, the importance of clear communication in enforcing health standards, and how crucial preventive measures are in minimizing public health risks. I also gained confidence in handling real situations that affect community wellbeing.', '1749202226435-919109872-0.png', 'checked', NULL, 'Not Signed', '2025-06-05', '2025-06-05 00:44:25'),
(58, '2025-04-06', '21904759', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Radiation monitoring and control ', 2, NULL, NULL, NULL, NULL, 'Port health (air, land and seaports)', 2, NULL, NULL, 'Disposal of the dead', 2, 'Today, I assisted in the inspection of a local food establishment for compliance with municipal health regulations. My tasks included checking food storage temperatures, verifying hygiene practices among kitchen staff, and filling out inspection forms under the supervision of the Environmental Health Practitioner.\r\n\r\n', 'During our routine inspection, we noticed that raw chicken was being stored directly above cooked food in a refrigerator. This violated food safety protocols. The EHP pointed out the risk of contamination and educated the kitchen manager on proper storage procedures. The manager was cooperative and immediately rearranged the items.\r\n\r\n', 'This event was significant because it demonstrated a real-life health hazard that could lead to foodborne illness if left unaddressed. It also showed the importance of clear communication and professional conduct when correcting health violations. As a student, it reinforced my theoretical knowledge with hands-on experience.', 'I learned the importance of vigilance during inspections and how effective communication is key to ensuring compliance without confrontation. I also realized the value of maintaining detailed records and offering solutions rather than just pointing out problems.\r\n\r\n', '1749202465760-161030693-0.png', 'unChecked', NULL, 'Not Signed', '2025-04-06', '2025-04-06 09:34:25'),
(64, '2025-05-11', '21904759', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Port health (air, land and seaports)', 2, 'Control & monitoring of hazardous substances', 2, 'Disposal of the dead', 2, 'During my Work Integrated Learning (WIL), I was involved in the control and monitoring of hazardous substances within the facility. This included inspecting storage areas, ensuring proper labeling, verifying safety data sheets, and conducting routine checks to ensure compliance with safety standards.', 'I observed a situation where a chemical spill occurred in the storage area due to improper labeling and handling. Immediate action was taken to contain the spill, and safety protocols were followed to mitigate risk.\r\n\r\n', 'This event was significant because it highlighted the importance of proper labeling, handling procedures, and routine monitoring. It demonstrated how lapses in safety measures could lead to potential health hazards or environmental damage.', 'From this experience, I learned the critical role of proactive monitoring and strict adherence to safety protocols when dealing with hazardous substances. It underscored the importance of vigilance and continuous training to prevent accidents.', '1749628805010-585884872-0.png', 'checked', NULL, 'Not Signed', '2025-05-11', '2025-05-11 08:00:05'),
(66, '2025-06-11', '21904759', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Health surveillance of premises', 1, 'Surveillance & prevention of communicable diseases and Malaria control ', 1, 'Port health (air, land and seaports)', 1, 'Control & monitoring of hazardous substances', 1, 'Disposal of the dead', 1, 'I assisted in routine inspections of healthcare and community premises to identify potential health hazards. This included monitoring hygiene standards, sanitation practices, and compliance with health regulations. I also participated in health risk assessments and documented findings.', 'During one inspection, I identified poor sanitation practices in a community rest area that could pose health risks to the public, I was involved in a malaria control campaign where larvicide was applied in stagnant water bodies near residential areas.', 'This event was significant because it highlighted how environmental conditions directly impact public health and the importance of timely intervention to prevent outbreaks.\r\nThis was significant because it demonstrated how targeted vector control measures can effectively reduce disease transmission and protect vulnerable populations.', 'I learned that proactive health surveillance is vital for early detection of hazards, which allows for prompt responses and improved health outcomes.\r\nI learned that coordinated efforts combining public education and environmental management are essential components of disease prevention.\r\n\r\n', '1749633592643-526062973-0.png', 'checked', '1749772751555-804154743-1746227644620-180024123-0.png', 'HI- 02154', '2025-06-11', '2025-06-12 23:59:11'),
(67, '2025-05-30', '21904759', 'Food Control', 1, 'Water Quality Monitoring', 1, 'Waste Management', 1, 'Vector Control Monitoring', 1, 'Chemical Safety', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Today I conducted inspections on various food outlets for compliance...', 'While conducting the inspection, I noticed improper food labeling...', 'This situation was significant as improper labeling can lead to foodborne illness...', 'I learned the importance of thorough labeling and documentation in food safety...', 'sig8.png', 'checked', 'supersig8.png', 'HI-12345', '2025-05-30', '2025-06-13 01:34:51'),
(68, '2025-05-30', '20253333', 'Food Control', 1, 'Monitoring water quality and availability', 1, 'Disposal of the dead', 1, 'Noise control Hour', 1, 'Chemical safety', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Performed assigned EH activities and recorded relevant data.', 'Observed several compliance issues during routine inspections.', 'The situation required prompt attention and follow-up.', 'Learned the importance of regular field evaluations and documentation.', 'signature.png', 'checked', 'sup_signature.png', 'HI-12345', '2025-05-30', '2025-06-13 01:37:59'),
(69, '2025-05-30', '20252222', 'Health surveillance of premises', 1, 'Disposal of the dead', 1, 'Waste Management', 1, 'Control & monitoring of hazardous substances', 1, 'Food Control', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Performed assigned EH activities and recorded relevant data.', 'Observed several compliance issues during routine inspections.', 'The situation required prompt attention and follow-up.', 'Learned the importance of regular field evaluations and documentation.', 'signature.png', 'checked', 'sup_signature.png', 'HI-12345', '2025-05-30', '2025-06-13 01:39:12'),
(70, '2025-05-30', '20253333', 'Control & monitoring of hazardous substances', 1, 'General hygiene monitoring', 1, 'Port health (air, land and seaports)', 1, 'Health surveillance of premises', 1, 'Noise control Hour', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Performed assigned EH activities and recorded relevant data.', 'Observed several compliance issues during routine inspections.', 'The situation required prompt attention and follow-up.', 'Learned the importance of regular field evaluations and documentation.', 'signature.png', 'checked', 'sup_signature.png', 'HI-12345', '2025-05-30', '2025-06-13 01:39:12'),
(71, '2025-05-30', '20254444', 'Monitoring water quality and availability', 1, 'General hygiene monitoring', 1, 'Port health (air, land and seaports)', 1, 'Vector control monitoring', 1, 'Noise control Hour', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Performed assigned EH activities and recorded relevant data.', 'Observed several compliance issues during routine inspections.', 'The situation required prompt attention and follow-up.', 'Learned the importance of regular field evaluations and documentation.', 'signature.png', 'checked', 'sup_signature.png', 'HI-12345', '2025-05-30', '2025-06-13 01:39:12'),
(72, '2025-05-30', '20255555', 'Food Control', 1, 'Port health (air, land and seaports)', 1, 'Vector control monitoring', 1, 'Monitoring water quality and availability', 1, 'Noise control Hour', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Performed assigned EH activities and recorded relevant data.', 'Observed several compliance issues during routine inspections.', 'The situation required prompt attention and follow-up.', 'Learned the importance of regular field evaluations and documentation.', 'signature.png', 'checked', 'sup_signature.png', 'HI-12345', '2025-05-30', '2025-06-13 01:39:12'),
(73, '2025-05-30', '20256666', 'Food Control', 1, 'Vector control monitoring', 1, 'Health surveillance of premises', 1, 'Chemical safety', 1, 'Noise control Hour', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Performed assigned EH activities and recorded relevant data.', 'Observed several compliance issues during routine inspections.', 'The situation required prompt attention and follow-up.', 'Learned the importance of regular field evaluations and documentation.', 'signature.png', 'checked', 'sup_signature.png', 'HI-12345', '2025-05-30', '2025-06-13 01:39:12'),
(74, '2025-05-30', '20257777', 'Chemical safety', 1, 'Disposal of the dead', 1, 'Radiation monitoring and control', 1, 'Waste Management', 1, 'Noise control Hour', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Performed assigned EH activities and recorded relevant data.', 'Observed several compliance issues during routine inspections.', 'The situation required prompt attention and follow-up.', 'Learned the importance of regular field evaluations and documentation.', 'signature.png', 'checked', 'sup_signature.png', 'HI-12345', '2025-05-30', '2025-06-13 01:39:12'),
(75, '2025-05-30', '20258888', 'Environmental pollution control (water & air)', 1, 'Noise control Hour', 1, 'Waste Management', 1, 'Food Control', 1, 'Port health (air, land and seaports)', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Performed assigned EH activities and recorded relevant data.', 'Observed several compliance issues during routine inspections.', 'The situation required prompt attention and follow-up.', 'Learned the importance of regular field evaluations and documentation.', 'signature.png', 'checked', 'sup_signature.png', 'HI-12345', '2025-05-30', '2025-06-13 01:39:12'),
(76, '2025-05-30', '21904759', 'Monitoring water quality and availability', 1, 'Noise control Hour', 1, 'Chemical safety', 1, 'Radiation monitoring and control', 1, 'Food Control', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Performed assigned EH activities and recorded relevant data.', 'Observed several compliance issues during routine inspections.', 'The situation required prompt attention and follow-up.', 'Learned the importance of regular field evaluations and documentation.', 'signature.png', 'checked', 'sup_signature.png', 'HI-12345', '2025-05-30', '2025-06-13 01:39:12'),
(77, '2025-05-30', '20229678', 'Health surveillance of premises', 1, 'General hygiene monitoring', 1, 'Noise control Hour', 1, 'Waste Management', 1, 'Monitoring water quality and availability', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Performed assigned EH activities and recorded relevant data.', 'Observed several compliance issues during routine inspections.', 'The situation required prompt attention and follow-up.', 'Learned the importance of regular field evaluations and documentation.', 'signature.png', 'checked', 'sup_signature.png', 'HI-12345', '2025-05-30', '2025-06-13 01:39:12'),
(78, '2025-05-30', '20251111', 'Chemical safety', 1, 'Vector control monitoring', 1, 'General hygiene monitoring', 1, 'Control & monitoring of hazardous substances', 1, 'Food Control', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Performed assigned EH activities and recorded relevant data.', 'Observed several compliance issues during routine inspections.', 'The situation required prompt attention and follow-up.', 'Learned the importance of regular field evaluations and documentation.', 'signature.png', 'checked', 'sup_signature.png', 'HI-12345', '2025-05-30', '2025-06-13 01:39:12'),
(79, '2025-06-01', '20252222', 'Food Control', 1, 'Waste Management', 1, 'General hygiene monitoring', 1, 'Vector control monitoring', 1, 'Chemical safety', 1, 'Noise control Hour', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Inspected food vendors, waste bins, and hygiene stations in a market.', 'Found food stored below required temperatures in one stall.', 'Temperature breach risks foodborne illness—issue escalated to owner.', 'Emphasized importance of cold-chain compliance during site visits.', 'sig1.png', 'checked', 'sup_signature.png', 'HI-20252222', '2025-06-01', '2025-06-13 01:45:19'),
(80, '2025-06-02', '20253333', 'Monitoring water quality and availability', 1, 'Environmental pollution control (water & air)', 1, 'Health surveillance of premises', 1, 'Surveillance & prevention of communicable diseases and Malaria control ', 1, 'Port health (air, land and seaports)', 1, 'Control & monitoring of hazardous substances', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Tested water samples and inspected premises for health code compliance.', 'Detected slightly elevated turbidity in community tap; premises well‑maintained.', 'Minor turbidity will be addressed; overall low risk.', 'Noted importance of routine monitoring and swift report handover.', 'sig2.png', 'checked', 'sup_signature.png', 'HI-20253333', '2025-06-02', '2025-06-13 01:45:19'),
(81, '2025-06-03', '20254444', 'Radiation monitoring and control ', 1, 'Port health (air, land and seaports)', 1, 'Disposal of the dead', 1, 'Food Control', 1, 'Vector control monitoring', 1, 'Waste Management', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Monitored radiation levels at hospital; checked port documentation and observed body disposal practices.', 'Radiation was within safe range; port docs complete; mourning site well managed.', 'All systems compliant; no immediate public health risk.', 'Confirmed that routine practices support safe public health infrastructure.', 'sig3.png', 'checked', 'sup_signature.png', 'HI-20254444', '2025-06-03', '2025-06-13 01:45:19'),
(82, '2025-06-04', '20255555', 'General hygiene monitoring', 1, 'Chemical safety', 1, 'Noise control Hour', 1, 'Environmental pollution control (water & air)', 1, 'Health surveillance of premises', 1, 'Surveillance & prevention of communicable diseases and Malaria control ', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Carried out hygiene audits, chemical storage checks, noise level readings, and premises inspections.', 'Found chemical storage unlabeled in one clinic; noise below legal threshold.', 'Chemical mislabel poses risk; noise safe; premises overall acceptable.', 'Planning targeted training for staff on chemical labeling and storage.', 'sig14.png', 'checked', 'sup_signature.png', 'HI-20255555', '2025-06-04', '2025-06-13 01:45:19'),
(83, '2025-06-05', '20256666', 'Monitoring water quality and availability', 1, 'Vector control monitoring', 1, 'Port health (air, land and seaports)', 1, 'Control & monitoring of hazardous substances', 1, 'Disposal of the dead', 1, 'Food Control', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Sampled water sources, applied vector control, reviewed port compliance, checked waste disposal, and audited food storage.', 'One source had turbidity; vector sites treated; found unlabeled chemicals.', 'Mixed risk; actions initiated in all areas.', 'Complex field operations highlight need for multi-disciplinary coordination.', 'sig5.png', 'checked', 'sup_signature.png', 'HI-20256666', '2025-06-05', '2025-06-13 01:45:19'),
(84, '2025-06-06', '20257777', 'Waste Management', 1, 'General hygiene monitoring', 1, 'Noise control Hour', 1, 'Health surveillance of premises', 1, 'Chemical safety', 1, 'Radiation monitoring and control ', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Assessed waste bins, hygiene stations, noise levels, premises cleanliness, chemical handling, and radiation safety.', 'Noted improper detergent use; hygiene good, radiation safe.', 'Mixed compliance; immediate correction done.', 'Field sampling teaches quick prioritization and corrective communication.', 'sig6.png', 'checked', 'sup_signature.png', 'HI-20257777', '2025-06-06', '2025-06-13 01:45:19'),
(85, '2025-06-07', '20258888', 'Surveillance & prevention of communicable diseases and Malaria control ', 1, 'Food Control', 1, 'Monitoring water quality and availability', 1, 'Waste Management', 1, 'Vector control monitoring', 1, 'Control & monitoring of hazardous substances', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Coordinated malaria campaign, inspected food safety, sampled water, and checked chemical storage.', 'Larvicide correctly applied; food vendors licensed; one chemical store under review.', 'Campaign well-executed; minor chemical storage issue flagged.', 'Integrated outbreak prevention demands coordination across sectors.', 'sig7.png', 'checked', 'sup_signature.png', 'HI-20258888', '2025-06-07', '2025-06-13 01:45:19'),
(86, '2025-06-08', '21904759', 'Port health (air, land and seaports)', 1, 'Health surveillance of premises', 1, 'Environmental pollution control (water & air)', 1, 'Noise control Hour', 1, 'Food Control', 1, 'Disposal of the dead', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Inspected port facilities, premises, pollution controls, noise levels, food outlets, and mortuary arrangements.', 'Some packaging was improperly labeled at port; premises clean; pollution within norms.', 'Port labeling non-compliant; rest acceptable.', 'Learned importance of multi-point inspections.', 'sig8.png', 'checked', 'sup_signature.png', 'HI-21904759', '2025-06-08', '2025-06-13 01:45:19'),
(87, '2025-06-09', '20229678', 'Food Control', 1, 'Monitoring water quality and availability', 1, 'Waste Management', 1, 'General hygiene monitoring', 1, 'Chemical safety', 1, 'Radiation monitoring and control ', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Reviewed food stalls, sampled water, assessed hygiene, chemical use, and radiation signage.', 'One stall had expired stock; water sample clear, hygiene good, chemistry sign missing.', 'Expired stock poses risk; rest low-risk.', 'Encouraged proactive inspections and vendor education.', 'sig9.png', 'checked', 'sup_signature.png', 'HI-20229678', '2025-06-09', '2025-06-13 01:45:19'),
(88, '2025-06-10', '20251111', 'Surveillance & prevention of communicable diseases and Malaria control ', 1, 'Environmental pollution control (water & air)', 1, 'Port health (air, land and seaports)', 1, 'Vector control monitoring', 1, 'Control & monitoring of hazardous substances', 1, 'Disposal of the dead', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Managed a malaria check campaign, monitored pollution, port practices, vector sites, and hazardous materials disposal.', 'Larvicide correctly applied; one hazardous container open; mortuary compliant.', 'Overall operation successful with minor non‑compliance.', 'Integrated actions prevented potential outbreaks and enforced safety.', 'sig10.png', 'checked', '1749870238387-950741119-1745320714301-292257806-Lungile Sign 2.png', 'HI- 02154', '2025-06-10', '2025-06-14 03:03:58'),
(89, '2025-06-10', '20252222', 'Waste Management', 1, 'Chemical safety', 1, 'Food Control', 1, 'Health surveillance of premises', 1, 'Port health (air, land and seaports)', 1, 'Noise control Hour', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Managed waste collection points, checked chemical storages, inspected food vendors, and monitored noise levels.', 'One chemical storage was improperly sealed; noise levels within allowed limits.', 'Chemical storage requires immediate sealing; noise levels pose no health risk.', 'Recommended refresher training on chemical handling and storage for staff.', 'sig10.png', 'checked', 'sup_signature.png', 'HI-20252222', '2025-06-10', '2025-06-13 01:47:20'),
(90, '2025-06-11', '20253333', 'Monitoring water quality and availability', 1, 'Vector control monitoring', 1, 'Surveillance & prevention of communicable diseases and Malaria control ', 1, 'Waste Management', 1, 'Disposal of the dead', 1, 'General hygiene monitoring', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Collected water samples, implemented vector control strategies, monitored communicable disease trends, and inspected hygiene practices.', 'Noted stagnant water pools breeding mosquitoes; hygiene standards improving.', 'Urgent vector control required; hygiene improving steadily.', 'Recommended community awareness sessions on mosquito breeding prevention.', 'sig11.png', 'checked', 'sup_signature.png', 'HI-20253333', '2025-06-11', '2025-06-13 01:47:20'),
(91, '2025-06-12', '20254444', 'Chemical safety', 1, 'Radiation monitoring and control ', 1, 'Environmental pollution control (water & air)', 1, 'Noise control Hour', 1, 'Food Control', 1, 'Health surveillance of premises', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Inspected chemical storage and handling, measured radiation levels, monitored pollution and noise, and reviewed food hygiene.', 'Radiation levels within limits; found mislabeled chemicals needing attention.', 'Overall safe environment; chemical labeling requires urgent correction.', 'Suggested mandatory chemical safety training for staff.', 'sig12.png', 'checked', 'sup_signature.png', 'HI-20254444', '2025-06-12', '2025-06-13 01:47:20'),
(92, '2025-06-13', '20255555', 'Food Control', 1, 'Waste Management', 1, 'General hygiene monitoring', 1, 'Surveillance & prevention of communicable diseases and Malaria control ', 1, 'Port health (air, land and seaports)', 1, 'Control & monitoring of hazardous substances', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Evaluated food safety protocols, waste disposal, hygiene standards, and port health compliance.', 'Food vendors generally compliant; waste bins overflowing in one area.', 'Overall good compliance; waste disposal system needs improvement.', 'Planned intervention for waste management at problematic sites.', '3sig1.png', 'checked', 'sup_signature.png', 'HI-20255555', '2025-06-13', '2025-06-13 01:47:20'),
(93, '2025-06-14', '20256666', 'Monitoring water quality and availability', 1, 'Vector control monitoring', 1, 'Noise control Hour', 1, 'Health surveillance of premises', 1, 'Radiation monitoring and control ', 1, 'Food Control', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Checked water sources for contamination, conducted vector control, monitored noise and radiation, and inspected food safety.', 'Water samples showed slight contamination; vector control effective.', 'Water contamination slight but monitored; vector control reducing disease risk.', 'Recommend ongoing water testing and community education.', 'sig14.png', 'checked', 'sup_signature.png', 'HI-20256666', '2025-06-14', '2025-06-13 01:47:20'),
(94, '2025-06-10', '20252222', 'Waste Management', 1, 'Chemical safety', 1, 'Food Control', 1, 'Health surveillance of premises', 1, 'Port health (air, land and seaports)', 1, 'Noise control Hour', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Managed waste collection points, checked chemical storages, inspected food vendors, and monitored noise levels.', 'One chemical storage was improperly sealed; noise levels within allowed limits.', 'Chemical storage requires immediate sealing; noise levels pose no health risk.', 'Recommended refresher training on chemical handling and storage for staff.', 'sig10.png', 'checked', 'sup_signature.png', 'HI-20252222', '2025-06-10', '2025-06-13 01:48:12'),
(95, '2025-06-11', '20253333', 'Monitoring water quality and availability', 1, 'Vector control monitoring', 1, 'Surveillance & prevention of communicable diseases and Malaria control ', 1, 'Waste Management', 1, 'Disposal of the dead', 1, 'General hygiene monitoring', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Collected water samples, implemented vector control strategies, monitored communicable disease trends, and inspected hygiene practices.', 'Noted stagnant water pools breeding mosquitoes; hygiene standards improving.', 'Urgent vector control required; hygiene improving steadily.', 'Recommended community awareness sessions on mosquito breeding prevention.', 'sig11.png', 'checked', 'sup_signature.png', 'HI-20253333', '2025-06-11', '2025-06-13 01:48:12'),
(96, '2025-06-12', '20254444', 'Chemical safety', 1, 'Radiation monitoring and control ', 1, 'Environmental pollution control (water & air)', 1, 'Noise control Hour', 1, 'Food Control', 1, 'Health surveillance of premises', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Inspected chemical storage and handling, measured radiation levels, monitored pollution and noise, and reviewed food hygiene.', 'Radiation levels within limits; found mislabeled chemicals needing attention.', 'Overall safe environment; chemical labeling requires urgent correction.', 'Suggested mandatory chemical safety training for staff.', 'sig12.png', 'checked', 'sup_signature.png', 'HI-20254444', '2025-06-12', '2025-06-13 01:48:12'),
(97, '2025-06-13', '21904759', 'Food Control', 1, 'Waste Management', 1, 'General hygiene monitoring', 1, 'Surveillance & prevention of communicable diseases and Malaria control ', 1, 'Port health (air, land and seaports)', 1, 'Control & monitoring of hazardous substances', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Evaluated food safety protocols, waste disposal, hygiene standards, and port health compliance.', 'Food vendors generally compliant; waste bins overflowing in one area.', 'Overall good compliance; waste disposal system needs improvement.', 'Planned intervention for waste management at problematic sites.', 'sig13.png', 'checked', 'sup_signature.png', 'HI-20255555', '2025-06-13', '2025-06-13 01:48:12'),
(98, '2025-06-14', '20256666', 'Monitoring water quality and availability', 1, 'Vector control monitoring', 1, 'Noise control Hour', 1, 'Health surveillance of premises', 1, 'Radiation monitoring and control ', 1, 'Food Control', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Checked water sources for contamination, conducted vector control, monitored noise and radiation, and inspected food safety.', 'Water samples showed slight contamination; vector control effective.', 'Water contamination slight but monitored; vector control reducing disease risk.', 'Recommend ongoing water testing and community education.', 'sig14.png', 'checked', 'sup_signature.png', 'HI-20256666', '2025-06-14', '2025-06-13 01:48:12'),
(99, '2025-06-15', '20257777', 'Waste Management', 1, 'General hygiene monitoring', 1, 'Chemical safety', 1, 'Disposal of the dead', 1, 'Port health (air, land and seaports)', 1, 'Environmental pollution control (water & air)', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Audited waste disposal, hygiene standards, chemical handling, corpse disposal, port inspections, and pollution levels.', 'Identified gaps in waste segregation; chemical storage improved.', 'Waste segregation requires urgent action; other areas satisfactory.', 'Plan to train waste handlers on segregation and disposal.', 'sig_20257777_15.png', 'checked', 'sup_20257777_15.png', 'HI-20257777', '2025-06-15', '2025-06-13 01:48:12'),
(100, '2025-06-16', '20258888', 'Surveillance & prevention of communicable diseases and Malaria control ', 1, 'Food Control', 1, 'Noise control Hour', 1, 'Health surveillance of premises', 1, 'Vector control monitoring', 1, 'Chemical safety', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Conducted disease surveillance, inspected food outlets, monitored noise, chemical safety, and vector control measures.', 'Disease incidence decreased; some food outlets had hygiene issues.', 'Good disease control; food hygiene needs improvement.', 'Recommend intensified food hygiene monitoring.', 'sig_20258888_16.png', 'checked', 'sup_20258888_16.png', 'HI-20258888', '2025-06-16', '2025-06-13 01:48:12');
INSERT INTO `daily_logsheet` (`id`, `log_date`, `student_number`, `activity1`, `hours1`, `activity2`, `hours2`, `activity3`, `hours3`, `activity4`, `hours4`, `activity5`, `hours5`, `activity6`, `hours6`, `activity7`, `hours7`, `activity8`, `hours8`, `activity9`, `hours9`, `activity10`, `hours10`, `activity11`, `hours11`, `activity12`, `hours12`, `activity13`, `hours13`, `activity14`, `hours14`, `description`, `situation_description`, `situation_evaluation`, `situation_interpretation`, `student_signature`, `mentor_check`, `supervisor_signature`, `EHP_HI_Number`, `date_stamp`, `created_at`) VALUES
(101, '2025-06-17', '20259999', 'Environmental pollution control (water & air)', 1, 'Disposal of the dead', 1, 'Port health (air, land and seaports)', 1, 'Monitoring water quality and availability', 1, 'General hygiene monitoring', 1, 'Waste Management', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Checked pollution levels, corpse disposal procedures, port health compliance, water quality, hygiene, and waste management.', 'Water contamination observed; corpse disposal protocols followed.', 'Water contamination needs addressing; other protocols satisfactory.', 'Plan for water purification and monitoring.', 'sig_20259999_17.png', 'checked', 'sup_20259999_17.png', 'HI-20259999', '2025-06-17', '2025-06-13 01:48:12'),
(102, '2025-06-18', '202511111', 'Noise control Hour', 1, 'Chemical safety', 1, 'Vector control monitoring', 1, 'Surveillance & prevention of communicable diseases and Malaria control ', 1, 'Food Control', 1, 'Health surveillance of premises', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Monitored noise levels, chemical handling, vector control, disease surveillance, food hygiene, and health premises inspections.', 'Noise levels fluctuating; chemical storage compliant; vector control effective.', 'Noise needs further investigation; chemical safety satisfactory; vector control working.', 'Suggest noise abatement measures; continue monitoring.', 'sig_202511111_18.png', 'checked', 'sup_202511111_18.png', 'HI-202511111', '2025-06-18', '2025-06-13 01:48:12'),
(103, '2025-06-19', '202522222', 'Food Control', 1, 'General hygiene monitoring', 1, 'Waste Management', 1, 'Environmental pollution control (water & air)', 1, 'Chemical safety', 1, 'Disposal of the dead', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Supervised food safety, hygiene practices, waste disposal, pollution control, chemical handling, and corpse disposal.', 'Food safety good; waste management poor in some areas.', 'Food control acceptable; waste management needs intervention.', 'Organize waste management training sessions.', 'sig_202522222_19.png', 'checked', 'sup_202522222_19.png', 'HI-202522222', '2025-06-19', '2025-06-13 01:48:12'),
(104, '2025-06-20', '202533333', 'Port health (air, land and seaports)', 1, 'Monitoring water quality and availability', 1, 'Vector control monitoring', 1, 'Waste Management', 1, 'Food Control', 1, 'Chemical safety', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Inspected port health facilities, checked water quality, conducted vector control, managed waste, and evaluated food and chemical safety.', 'Port health well managed; water quality variable.', 'Port health satisfactory; water needs further testing.', 'Recommend increased water quality sampling at ports.', 'sig_202533333_20.png', 'checked', 'sup_202533333_20.png', 'HI-202533333', '2025-06-20', '2025-06-13 01:48:12');

-- --------------------------------------------------------

--
-- Table structure for table `declaration_letters`
--

CREATE TABLE `declaration_letters` (
  `id` int(11) NOT NULL,
  `declaration_date` date NOT NULL,
  `student_number` varchar(10) DEFAULT NULL,
  `supervisor_name` varchar(255) NOT NULL,
  `employer_name` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `hi_number` varchar(50) NOT NULL,
  `student_name` varchar(255) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `work_ethic` enum('Good','Bad') NOT NULL,
  `timeliness` enum('Good','Bad') NOT NULL,
  `attitude` enum('Good','Bad') NOT NULL,
  `dress` enum('Good','Bad') NOT NULL,
  `interaction` enum('Good','Bad') NOT NULL,
  `responsibility` enum('Good','Bad') NOT NULL,
  `report_writing` enum('Good','Bad') NOT NULL,
  `general_comments` text DEFAULT NULL,
  `supervisor_signature` varchar(255) DEFAULT NULL,
  `signature_date` date NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `declaration_letters`
--

INSERT INTO `declaration_letters` (`id`, `declaration_date`, `student_number`, `supervisor_name`, `employer_name`, `position`, `hi_number`, `student_name`, `start_date`, `end_date`, `work_ethic`, `timeliness`, `attitude`, `dress`, `interaction`, `responsibility`, `report_writing`, `general_comments`, `supervisor_signature`, `signature_date`, `created_at`, `updated_at`) VALUES
(3, '2024-01-10', NULL, 'Thabo Mthembu', 'eThekwini Municipality', 'EHP', 'HI-11223', 'Lindiwe Dlamini', '2023-10-01', '2023-12-30', 'Good', 'Good', 'Bad', 'Good', 'Bad', 'Good', 'Good', 'Attitude needs improvement.', 'sig3.png', '2024-01-10', '2025-04-29 22:00:00', '2025-05-01 01:12:34'),
(4, '2024-06-18', NULL, 'Nomfundo Zulu', 'Department of Health', 'Junior EHP', 'HI-55667', 'Siyabonga Ntuli', '2024-03-01', '2024-06-01', 'Bad', 'Bad', 'Bad', 'Bad', 'Bad', 'Bad', 'Bad', 'Unsatisfactory performance.', 'sig4.png', '2024-06-18', '2025-04-29 22:00:00', '2025-05-01 01:12:39'),
(5, '2024-08-01', NULL, 'Karabo Khoza', 'Durban Solid Waste', 'Field Supervisor', 'HI-99887', 'Thando Majozi', '2024-04-01', '2024-07-30', 'Good', 'Good', 'Good', 'Good', 'Good', 'Good', 'Good', 'Well-rounded and reliable student.', 'sig5.png', '2024-08-01', '2025-04-29 22:00:00', '2025-05-01 01:15:38'),
(6, '2023-11-05', NULL, 'Zanele Ndlovu', 'uMgungundlovu District', 'Senior EHP', 'HI-11224', 'Ayanda Khumalo', '2023-08-01', '2023-10-30', 'Bad', 'Good', 'Good', 'Good', 'Good', 'Bad', 'Good', 'Needs to take more responsibility.', 'sig6.png', '2023-11-05', '2025-04-29 22:00:00', '2025-05-01 01:15:44'),
(7, '2025-01-15', NULL, 'Sipho Dube', 'Coastal Municipality', 'Supervisor', 'HI-12399', 'Nokuthula Mnguni', '2024-09-01', '2024-12-01', 'Good', 'Bad', 'Good', 'Bad', 'Good', 'Good', 'Good', 'Timeliness needs improvement.', 'sig7.png', '2025-01-15', '2025-04-29 22:00:00', '2025-05-01 01:15:50'),
(8, '2025-03-10', NULL, 'Nolwazi Zuma', 'Environmental Services', 'Senior EHP', 'HI-10101', 'Musa Ndlovu', '2024-12-01', '2025-02-28', 'Good', 'Good', 'Good', 'Good', 'Bad', 'Good', 'Good', 'Lacks engagement with team.', 'sig8.png', '2025-03-10', '2025-04-29 22:00:00', '2025-05-01 01:38:51'),
(9, '2023-12-20', NULL, 'Sibusiso Cele', 'KwaDukuza Municipality', 'EHP', 'HI-88888', 'Nomvula Khathi', '2023-09-01', '2023-12-01', 'Good', 'Good', 'Good', 'Good', 'Good', 'Good', 'Good', 'Excellent student.', 'sig9.png', '2023-12-20', '2025-04-29 22:00:00', '2025-05-01 01:15:59'),
(10, '2024-02-25', NULL, 'Mbali Shange', 'Department of Agriculture', 'Inspector', 'HI-22334', 'Jabulani Mbatha', '2023-11-01', '2024-02-01', 'Bad', 'Bad', 'Bad', 'Bad', 'Bad', 'Bad', 'Bad', 'No progress shown during placement.', 'sig10.png', '2024-02-25', '2025-04-29 22:00:00', '2025-05-01 01:16:03'),
(11, '2025-04-01', NULL, 'Bongani Mkhize', 'Private Consulting', 'Consultant EHP', 'HI-33445', 'Khanyi Sibisi', '2025-01-01', '2025-03-30', 'Good', 'Good', 'Good', 'Good', 'Good', 'Good', 'Good', 'Brilliant and focused.', 'sig11.png', '2025-04-01', '2025-04-29 22:00:00', '2025-05-01 01:24:17'),
(12, '2024-05-05', NULL, 'Nandi Gwala', 'Health & Safety SA', 'HSE Officer', 'HI-55678', 'Mxolisi Zondo', '2024-02-01', '2024-04-30', 'Good', 'Bad', 'Good', 'Good', 'Bad', 'Good', 'Bad', 'Some gaps in writing and interaction.', 'sig12.png', '2024-05-05', '2025-04-29 22:00:00', '2025-05-01 01:24:23'),
(13, '2023-10-01', NULL, 'Andile Ncube', 'City of Joburg', 'Senior EHP', 'HI-67890', 'Thuli Ndlela', '2023-06-01', '2023-09-01', 'Good', 'Good', 'Good', 'Good', 'Good', 'Good', 'Good', 'Top performing student.', 'sig13.png', '2023-10-01', '2025-04-29 22:00:00', '2025-05-01 01:24:28'),
(14, '2024-11-15', NULL, 'Xolani Dlamini', 'WastePro', 'Site Lead', 'HI-78901', 'Lucky Mthembu', '2024-08-01', '2024-10-31', 'Bad', 'Bad', 'Good', 'Good', 'Good', 'Bad', 'Good', 'Needs better time management and initiative.', 'sig14.png', '2024-11-15', '2025-04-29 22:00:00', '2025-05-01 01:24:52'),
(15, '2025-02-20', NULL, 'Zanele Khuzwayo', 'Metro Health Services', 'EHP Assistant', 'HI-90001', 'Zandile Cele', '2024-11-01', '2025-01-31', 'Good', 'Good', 'Good', 'Good', 'Good', 'Good', 'Good', 'Excellent collaboration and communication.', 'sig15.png', '2025-02-20', '2025-04-29 22:00:00', '2025-05-01 01:24:32'),
(17, '2025-05-26', '21904759', 'Thabo Mthembu', 'eThekwini Municipality', 'Field Supervisor', 'HI-11223', 'Siphelele Maphumulo', '2025-01-13', '2025-12-12', 'Good', 'Bad', 'Good', 'Good', 'Bad', 'Bad', 'Bad', 'Time management, Responsibility as an employee, Interaction with team members and report writing needs improvement.', '1748303348935-38238849-sig8.png', '2025-05-26', '2025-05-26 23:49:08', '2025-05-26 23:49:08');

-- --------------------------------------------------------

--
-- Table structure for table `declaration_report`
--

CREATE TABLE `declaration_report` (
  `declaration_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `mentor_id` int(11) DEFAULT NULL,
  `work_ethic` enum('Good','Bad') DEFAULT NULL,
  `timeliness` enum('Good','Bad') DEFAULT NULL,
  `attitude` enum('Good','Bad') DEFAULT NULL,
  `dress_code` enum('Good','Bad') DEFAULT NULL,
  `interaction_with_personnel` enum('Good','Bad') DEFAULT NULL,
  `responsibility` enum('Good','Bad') DEFAULT NULL,
  `report_writing` enum('Good','Bad') DEFAULT NULL,
  `general_comments` text DEFAULT NULL,
  `date` timestamp NOT NULL DEFAULT current_timestamp(),
  `official_stamp` mediumblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `event_attendance`
--

CREATE TABLE `event_attendance` (
  `id` int(11) NOT NULL,
  `event_id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `attended` enum('Yes','No') NOT NULL DEFAULT 'Yes',
  `signed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_attendance`
--

INSERT INTO `event_attendance` (`id`, `event_id`, `student_id`, `attended`, `signed_at`) VALUES
(26, 1, 1, 'Yes', '2025-05-20 22:00:00'),
(27, 1, 6, 'Yes', '2025-06-02 22:00:00'),
(28, 1, 8, '', '2025-06-10 22:00:00'),
(33, 1, 3, '', '2025-05-19 22:00:00'),
(34, 1, 2, 'Yes', '2025-05-31 22:00:00'),
(35, 1, 5, 'Yes', '2025-05-20 22:00:00'),
(36, 1, 4, 'Yes', '2025-05-18 22:00:00'),
(37, 2, 8, 'Yes', '2025-05-29 22:00:00'),
(38, 2, 2, '', '2025-06-05 22:00:00'),
(39, 2, 1, '', '2025-05-19 22:00:00'),
(40, 2, 5, '', '2025-05-24 22:00:00'),
(41, 2, 3, '', '2025-05-27 22:00:00'),
(46, 2, 6, 'Yes', '2025-05-27 22:00:00'),
(47, 2, 4, '', '2025-05-28 22:00:00'),
(48, 3, 1, 'Yes', '2025-05-21 22:00:00'),
(50, 3, 8, 'Yes', '2025-05-31 22:00:00'),
(51, 3, 6, 'Yes', '2025-06-04 22:00:00'),
(52, 3, 4, '', '2025-05-28 22:00:00'),
(53, 3, 3, '', '2025-05-30 22:00:00'),
(57, 3, 2, 'Yes', '2025-05-16 22:00:00'),
(58, 3, 5, 'Yes', '2025-05-27 22:00:00'),
(59, 4, 5, '', '2025-06-03 22:00:00'),
(60, 4, 4, '', '2025-05-25 22:00:00'),
(63, 4, 1, 'Yes', '2025-06-05 22:00:00'),
(64, 4, 8, 'Yes', '2025-05-30 22:00:00'),
(67, 4, 2, 'Yes', '2025-06-01 22:00:00'),
(68, 4, 6, 'Yes', '2025-05-29 22:00:00'),
(69, 4, 3, 'Yes', '2025-06-01 22:00:00'),
(72, 5, 2, 'Yes', '2025-06-01 22:00:00'),
(74, 5, 5, '', '2025-05-30 22:00:00'),
(76, 5, 3, '', '2025-06-10 22:00:00'),
(77, 5, 4, '', '2025-05-22 22:00:00'),
(78, 5, 8, 'Yes', '2025-05-19 22:00:00'),
(79, 5, 1, 'Yes', '2025-05-26 22:00:00'),
(80, 5, 6, '', '2025-05-17 22:00:00'),
(81, 6, 4, '', '2025-06-04 22:00:00'),
(82, 6, 5, '', '2025-05-15 22:00:00'),
(83, 6, 2, '', '2025-06-02 22:00:00'),
(84, 6, 3, 'Yes', '2025-06-12 22:00:00'),
(87, 6, 1, 'Yes', '2025-05-20 22:00:00'),
(88, 6, 6, '', '2025-06-12 22:00:00'),
(90, 6, 8, 'Yes', '2025-05-25 22:00:00'),
(94, 7, 4, '', '2025-05-25 22:00:00'),
(95, 7, 3, '', '2025-05-31 22:00:00'),
(98, 7, 27, '', '2025-06-14 02:59:02');

-- --------------------------------------------------------

--
-- Table structure for table `event_codes`
--

CREATE TABLE `event_codes` (
  `event_code` varchar(6) NOT NULL,
  `guest_name` varchar(255) NOT NULL,
  `guest_email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `event_codes`
--

INSERT INTO `event_codes` (`event_code`, `guest_name`, `guest_email`, `created_at`) VALUES
('Crqy9d', 'Siphelele Maphumulo', 'Siphelelemaphumulo@gmail.com', '2025-05-25 12:22:31');

-- --------------------------------------------------------

--
-- Table structure for table `guest_lectures`
--

CREATE TABLE `guest_lectures` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `guest_name` varchar(100) DEFAULT NULL,
  `event_type` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `document_path` varchar(255) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `register_status` enum('active','inactive') DEFAULT 'inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `guest_lectures`
--

INSERT INTO `guest_lectures` (`id`, `title`, `guest_name`, `event_type`, `event_date`, `document_path`, `created_by`, `created_at`, `register_status`) VALUES
(1, 'Introduction To Data science and Metaplot', 'Siphelele Maphumulo', 'Guest Lecture', '2025-05-26', 'uploads/1748176519927-687296208-Siphelele_Cover_Letter_Mayerfeld.pdf', NULL, '0000-00-00 00:00:00', 'inactive'),
(2, 'Health & Hygiene Awareness', 'Dr. Thuli Mkhize', 'Field Trip', '2025-06-01', 'uploads/hygiene.pdf', 1, '2025-06-12 15:29:49', 'inactive'),
(3, 'Water Quality Control', 'Prof. Themba Zulu', 'Workshop', '2025-06-05', 'uploads/water_quality.pdf', 2, '2025-06-12 15:29:49', 'inactive'),
(4, 'Food Safety Regulations', 'Ms. Ayanda Sithole', 'Guest Lecture', '2025-06-10', 'uploads/food_safety.pdf', 1, '2025-06-12 15:29:49', 'inactive'),
(5, 'Waste Management Innovation', 'Dr. Sipho Khumalo', 'Field Trip', '2025-06-15', 'uploads/waste_mgmt.pdf', 3, '2025-06-12 15:29:49', 'inactive'),
(6, 'Environmental Law Basics', 'Adv. Lerato Mokoena', 'Workshop', '2025-06-20', 'uploads/env_law.pdf', 4, '2025-06-12 15:29:49', 'inactive'),
(7, 'Community Clean-Up Drive', 'Mr. Bongani Dlamini', 'Field Trip', '2025-06-25', 'uploads/cleanup_drive.pdf', 2, '2025-06-12 15:29:49', 'inactive'),
(20, 'Introduction To Data science and Metaplot', 'Siphelele Maphumulo', 'Guest Lecture', '2025-06-12', 'uploads/1749710162692-58345507-1745315554843-43462014-2024 registration.pdf', NULL, '0000-00-00 00:00:00', 'inactive');

-- --------------------------------------------------------

--
-- Table structure for table `hospitals`
--

CREATE TABLE `hospitals` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hospitals`
--

INSERT INTO `hospitals` (`id`, `name`) VALUES
(1, 'Chris Hani Baragwanath Hospital'),
(2, 'Groote Schuur Hospital'),
(3, 'Charlotte Maxeke Johannesburg Hospital'),
(4, 'Steve Biko Academic Hospital'),
(5, 'Inkosi Albert Luthuli Central Hospital'),
(6, 'Tygerberg Hospital'),
(7, 'Nelson Mandela Academic Hospital'),
(8, 'George Hospital'),
(9, 'Polokwane Provincial Hospital'),
(10, 'Mankweng Hospital'),
(11, 'Universitas Academic Hospital'),
(12, 'Pietersburg Hospital'),
(13, 'Frere Hospital'),
(14, 'Livingstone Hospital'),
(15, 'Grey’s Hospital'),
(16, 'Addington Hospital'),
(17, 'King Edward VIII Hospital'),
(18, 'Rob Ferreira Hospital'),
(19, 'Tembisa Hospital'),
(20, 'Leratong Hospital'),
(21, 'Rahima Moosa Mother and Child Hospital'),
(22, 'Red Cross War Memorial Children’s Hospital');

-- --------------------------------------------------------

--
-- Table structure for table `hpcsa_auditor`
--

CREATE TABLE `hpcsa_auditor` (
  `id` int(11) NOT NULL,
  `hi_number` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `contact` varchar(20) DEFAULT NULL,
  `hpcsa_signature` text DEFAULT NULL,
  `status` enum('active','inactive') DEFAULT 'active',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `hpcsa_auditor`
--

INSERT INTO `hpcsa_auditor` (`id`, `hi_number`, `name`, `surname`, `email`, `password`, `contact`, `hpcsa_signature`, `status`, `created_at`, `updated_at`) VALUES
(1, 'MP123456', 'Abegail', 'Ndlovu', 'abegailN@hpcsa.co.za', '$2b$10$qlBTdwhNeBTRkhYEL7sUmeorO.hYQgwKoZptG7N4EbOF0lSvq7zOu', '21904759@live.mut.ac', 'C:\\xampp\\htdocs\\New folder\\backend\\uploads\\1749798813810-987273212-0.png', 'active', '2025-06-13 07:13:34', '2025-06-14 02:29:38'),
(5, 'MP123457', 'Basani', 'Memela', 'BasaniM@hpcsa.co.za', '$2b$10$.RxDZGtMbwPLllOpV.MTMOVgnmZDcC9iryTwpxrKM2zW6MUobkYb6', '21904759@live.mut.ac', NULL, 'active', '2025-06-13 07:21:49', '2025-06-14 02:31:08');

-- --------------------------------------------------------

--
-- Table structure for table `hpcsa_report`
--

CREATE TABLE `hpcsa_report` (
  `id` int(11) NOT NULL,
  `hi_number` varchar(50) DEFAULT NULL,
  `name_of_coordinator` varchar(100) DEFAULT 'MT Mtshengu',
  `student_number` varchar(50) DEFAULT NULL,
  `student_name` varchar(100) DEFAULT NULL,
  `student_surname` varchar(100) DEFAULT NULL,
  `student_email` varchar(100) DEFAULT NULL,
  `level_of_study` varchar(10) NOT NULL DEFAULT '1st',
  `total_wil_hours` int(11) DEFAULT NULL,
  `total_days` int(11) DEFAULT NULL,
  `check_status` varchar(50) DEFAULT 'No'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `hpcsa_report`
--

INSERT INTO `hpcsa_report` (`id`, `hi_number`, `name_of_coordinator`, `student_number`, `student_name`, `student_surname`, `student_email`, `level_of_study`, `total_wil_hours`, `total_days`, `check_status`) VALUES
(1, 'HI-02154', 'MT Mtshengu', '20251111', 'Thabo', 'Mkhize', '20251111@live.mut.ac.za\n', '1st', 12, 2, 'Yes'),
(2, 'HI-02154', 'MT Mtshengu', '20252222', 'Nomusa', 'Nkosi', '20252222@live.mut.ac.za\n', '2nd', 6, 1, 'no'),
(3, 'HI-02154', 'MT Mtshengu', '20253333', 'Lwazi', 'Sibeko', '20253333@live.mut.ac.za\n', '2nd', 6, 1, 'No'),
(4, 'HI-02154', 'MT Mtshengu', '20255555', 'Kgosi', 'Mokoena', '20255555@live.mut.ac.za\n', '3rd', 12, 2, 'No'),
(5, 'HI-02154', 'MT Mtshengu', '20256666', 'Mpho', 'Pule', '20256666@live.mut.ac.za\n', '1st', 6, 1, 'No'),
(7, 'HI- 02154', 'MT Mtshengu', '21904759', 'Siphelele', 'Maphumulo', '21904759@live.mut.ac.za', '1st', 33, 5, 'no'),
(8, 'HI- 02154', 'MT Mtshengu', '20257777', 'Tiaan', 'Jansen', '20257777@live.mut.ac.za', '1st', 6, 1, 'no'),
(9, 'HI- 02154', 'MT Mtshengu', '20259999', 'Victor', 'Rossouw', '20259999@live.mut.ac.za', '3rd', 6, 1, 'No'),
(10, 'HI- 02154', 'MT Mtshengu', '20258888', 'Bongi', 'Khumalo', '20258888@live.mut.ac.za\n', '1st', 17, 3, 'No'),
(11, 'HI- 02154', 'MT Mtshengu', '20254444', 'Tammy', 'Jacobs', '20254444@live.mut.ac.za\n', '1st', 540, 90, 'No');

-- --------------------------------------------------------

--
-- Table structure for table `mentor_signatures`
--

CREATE TABLE `mentor_signatures` (
  `id` int(11) NOT NULL,
  `mentor_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `signature_image` longtext NOT NULL,
  `signature_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `document_type` varchar(50) DEFAULT NULL,
  `document_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `mentor_users`
--

CREATE TABLE `mentor_users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `title` varchar(10) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userRole` varchar(50) NOT NULL DEFAULT 'mentor',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('inactive','active','suspended') DEFAULT 'inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `mentor_users`
--

INSERT INTO `mentor_users` (`id`, `email`, `title`, `password`, `userRole`, `created_at`, `status`) VALUES
(1, 'cele.khulekani@mut.ac.za', 'Mr', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW65fa5KG0gS', 'mentor', '2025-06-11 13:08:59', 'inactive'),
(2, 'thobile@mut.ac.za', 'Mrs', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW65fa5KG0gS', 'mentor', '2025-06-11 13:08:59', 'inactive');

-- --------------------------------------------------------

--
-- Table structure for table `municipalities`
--

CREATE TABLE `municipalities` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `municipalities`
--

INSERT INTO `municipalities` (`id`, `name`) VALUES
(1, 'City of Johannesburg'),
(2, 'City of Cape Town'),
(3, 'City of Tshwane'),
(4, 'Ekurhuleni'),
(5, 'eThekwini'),
(6, 'Buffalo City'),
(7, 'Mangaung'),
(8, 'Polokwane'),
(9, 'Mbombela'),
(10, 'Rustenburg'),
(11, 'Sol Plaatje'),
(12, 'Nelson Mandela Bay'),
(13, 'Drakenstein'),
(14, 'George'),
(15, 'Msunduzi'),
(16, 'Matjhabeng'),
(17, 'Emfuleni'),
(18, 'Mogale City'),
(19, 'Govan Mbeki'),
(20, 'Lekwa'),
(21, 'uMhlathuze'),
(22, 'uMgungundlovu'),
(23, 'Overstrand'),
(24, 'Tlokwe'),
(25, 'Stellenbosch');

-- --------------------------------------------------------

--
-- Table structure for table `mut_staff`
--

CREATE TABLE `mut_staff` (
  `mut_staff_number_id` int(11) NOT NULL,
  `first_name` varchar(250) DEFAULT NULL,
  `last_name` varchar(250) DEFAULT NULL,
  `mut_email` varchar(320) DEFAULT NULL,
  `mut_staff_title` enum('Admin','WIL Coordinator','Secretary') DEFAULT NULL,
  `hashed_password` varchar(350) DEFAULT NULL,
  `phone_number` char(20) DEFAULT NULL,
  `work_phone_number` char(12) DEFAULT NULL,
  `alt_phone_number` char(12) DEFAULT NULL,
  `status` enum('Active','Inactive','Suspended') DEFAULT 'Active',
  `signature` mediumblob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `organisation`
--

CREATE TABLE `organisation` (
  `organisation_id` int(11) NOT NULL,
  `organisation_name` varchar(100) DEFAULT NULL,
  `organisation_address` varchar(250) DEFAULT NULL,
  `contact_person_name` varchar(100) DEFAULT NULL,
  `contact_person_email` varchar(320) DEFAULT NULL,
  `contact_person_phone_number` char(26) DEFAULT NULL,
  `telephone_number` char(12) DEFAULT NULL,
  `organisation_type` enum('Municipal','Private','Government','NGO') DEFAULT NULL,
  `town_situated` varchar(250) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `signup_codes`
--

CREATE TABLE `signup_codes` (
  `id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `code` varchar(8) NOT NULL,
  `first_names` varchar(100) NOT NULL,
  `surname` varchar(100) NOT NULL,
  `student_number` varchar(20) NOT NULL,
  `level_of_study` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `signup_codes`
--

INSERT INTO `signup_codes` (`id`, `application_id`, `code`, `first_names`, `surname`, `student_number`, `level_of_study`, `email`, `created_at`) VALUES
(16, 27, 'B1KBQ6WX', 'Pero', 'Ngcobo', '21904759', '1', 'Siphelelemaphumulo@gmail.com', '2025-05-25 20:09:20');

-- --------------------------------------------------------

--
-- Table structure for table `staff_codes`
--

CREATE TABLE `staff_codes` (
  `code` varchar(6) NOT NULL,
  `staff_name` varchar(255) NOT NULL,
  `staff_email` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_signatures`
--

CREATE TABLE `staff_signatures` (
  `id` int(11) NOT NULL,
  `staff_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `signature_image` longtext NOT NULL,
  `signature_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `document_type` varchar(50) DEFAULT NULL,
  `document_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `staff_users`
--

CREATE TABLE `staff_users` (
  `staff_id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `title` varchar(10) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userRole` varchar(50) NOT NULL DEFAULT 'staff',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `staff_users`
--

INSERT INTO `staff_users` (`staff_id`, `email`, `title`, `password`, `userRole`, `created_at`) VALUES
(1, 'poswa@mut.ac.za', 'Dr', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW65fa5KG0gS', 'admin', '2025-06-11 13:11:03'),
(2, 'Mshengu.thuli@mut.ac.za', 'Mrs', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW65fa5KG0gS', 'admin', '2025-05-01 16:38:26'),
(4, 'zanele@mut.ac.za', 'Mrs', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW65fa5KG0gS', 'staff', '2025-06-11 13:13:23'),
(5, 'ana@mut.ac.za', 'Mrs', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW65fa5KG0gS', 'staff', '2025-06-11 13:13:23'),
(7, 'govender.trishka@mut.ac.za', 'Mrs', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW65fa5KG0gS', 'staff', '2025-06-11 13:19:44'),
(8, 'toh@mut.ac.za', 'Mrs', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW65fa5KG0gS', 'secretary', '2025-06-11 13:19:44'),
(9, 'mnguni.gugu@mut.ac.za', 'Mrs', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW65fa5KG0gS', 'research', '2025-06-11 13:21:04');

-- --------------------------------------------------------

--
-- Table structure for table `student`
--

CREATE TABLE `student` (
  `student_number_id` int(11) NOT NULL,
  `first_name` varchar(250) DEFAULT NULL,
  `last_name` varchar(250) DEFAULT NULL,
  `title` enum('Mr','Ms','Mrs','Dr','Prof') DEFAULT NULL,
  `race` enum('Black','Coloured','Indian','White','Other') DEFAULT NULL,
  `initials` varchar(10) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `enrollment_year` year(4) DEFAULT NULL,
  `level_of_study` enum('First Year','Second Year','Third Year','Fourth Year') DEFAULT NULL,
  `qualification` varchar(250) DEFAULT 'BSc Environmental Health',
  `student_email` varchar(320) DEFAULT NULL,
  `hashed_password` varchar(350) DEFAULT NULL,
  `phone_number` char(12) DEFAULT NULL,
  `alt_phone_number` char(12) DEFAULT NULL,
  `status` enum('Active','Inactive','Graduated','Suspended') DEFAULT 'Active',
  `id_number` char(13) DEFAULT NULL,
  `gender` enum('Male','Female') DEFAULT NULL,
  `cv_document` mediumblob DEFAULT NULL,
  `id_document` mediumblob DEFAULT NULL,
  `province_of_residence` enum('Eastern Cape','Free State','Gauteng','KwaZulu-Natal','Limpopo','Mpumalanga','Northern Cape','North West','Western Cape') DEFAULT 'KwaZulu-Natal',
  `physical_address` varchar(250) DEFAULT NULL,
  `home_town` varchar(250) DEFAULT NULL,
  `signature` mediumblob DEFAULT NULL,
  `date_account_created` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_documents`
--

CREATE TABLE `student_documents` (
  `document_id` int(11) NOT NULL,
  `student_number_id` int(11) DEFAULT NULL,
  `document_type` enum('cv_document','id_document','signature') DEFAULT NULL,
  `document_data` mediumblob DEFAULT NULL,
  `document_checksum` char(64) DEFAULT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_placements`
--

CREATE TABLE `student_placements` (
  `id` int(11) NOT NULL,
  `student_number` varchar(10) NOT NULL,
  `student_name` varchar(100) NOT NULL,
  `supervisor` varchar(100) NOT NULL,
  `municipality` varchar(100) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `cell_number` varchar(20) DEFAULT NULL,
  `hospital` varchar(100) DEFAULT NULL,
  `abattoir` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_placements`
--

INSERT INTO `student_placements` (`id`, `student_number`, `student_name`, `supervisor`, `municipality`, `email`, `cell_number`, `hospital`, `abattoir`, `created_at`) VALUES
(1, '20252222', 'Nomusa Nkosi', 'Mr. Thabo Mokoena', 'Cape Town', 'hospitalcpt@gov.ac.za', '0712345678', 'Hospital Cape Town', 'Abattoir Cape Town', '2024-03-14 22:00:00'),
(2, '20253333', 'Lwazi Sibeko', 'Ms. Zanele Ndlovu', 'Johannesburg', 'hospitaljhb@gov.ac.za', '0723456789', 'Hospital Johannesburg', 'Abattoir Johannesburg', '2024-04-19 22:00:00'),
(3, '20254444', 'Tammy Jacobs', 'Dr. Sipho Dlamini', 'Durban', 'hospitaldurban@gov.ac.za', '0734567890', 'Hospital Durban', 'Abattoir Durban', '2024-05-09 22:00:00'),
(4, '20255555', 'Kgosi Mokoena', 'Mr. Mandla Mthembu', 'Pretoria', 'hospitalpta@gov.ac.za', '0745678901', 'Hospital Pretoria', 'Abattoir Pretoria', '2024-02-24 22:00:00'),
(5, '20256666', 'Mpho Pule', 'Ms. Nomsa Khumalo', 'Bloemfontein', 'hospitalblf@gov.ac.za', '0756789012', 'Hospital Bloemfontein', 'Abattoir Bloemfontein', '2024-01-17 22:00:00'),
(6, '20257777', 'Tiaan Jansen', 'Dr. Johan van der Merwe', 'Port Elizabeth', 'hospitalpe@gov.ac.za', '0767890123', 'Hospital Port Elizabeth', 'Abattoir Port Elizabeth', '2024-03-04 22:00:00'),
(7, '20258888', 'Bongi Khumalo', 'Ms. Fanele Njoko', 'Pietermaritzburg', 'hospitalpmb@gov.ac.za', '0778901234', 'Hospital Pietermaritzburg', 'Abattoir Pietermaritzburg', '2024-02-14 22:00:00'),
(8, '21904759', 'Siphelele Maphumulo', 'Mr Lwazi Mpongose', 'eThekwini', 'LMpongose@kingEdward.ac.za', '031 907 5321', 'King Edward VIII Hospital', 'King Edward', '2024-03-14 22:00:00'),
(9, '20229678', 'Keegan Pillay', 'Ms. Thili Ndlovu', 'Johannesburg', 'hospitaljhb@gov.ac.za', '0713556789', 'Hospital Johannesburg', 'Abattoir Johannesburg', '2024-04-19 22:00:00'),
(10, '20251111', 'Sammy Smith', 'Dr. Sipho Mtshali', 'Durban', 'hospitaldurban@gov.ac.za', '0314567890', 'Hospital Durban', 'Abattoir Durban', '2024-05-09 22:00:00'),
(11, '20250123', 'Siphelelele Mthembu', 'Dr. Zulu', 'eThekwini', 'SMthembu@gov.ac.za', '0761234567', 'Prince Mshiyeni', 'Shongweni', '2025-05-28 12:44:40');

-- --------------------------------------------------------

--
-- Table structure for table `student_reflections`
--

CREATE TABLE `student_reflections` (
  `id` int(11) NOT NULL,
  `student_number` varchar(20) NOT NULL,
  `level_of_study` varchar(50) NOT NULL DEFAULT '1',
  `student_name` varchar(100) NOT NULL,
  `feeling` text DEFAULT NULL,
  `success` text DEFAULT NULL,
  `challenges` text DEFAULT NULL,
  `perspective_change` text DEFAULT NULL,
  `suggestions` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_reflections`
--

INSERT INTO `student_reflections` (`id`, `student_number`, `level_of_study`, `student_name`, `feeling`, `success`, `challenges`, `perspective_change`, `suggestions`, `created_at`) VALUES
(1, '20252222', '1', 'Nomusa Nkosi', 'Excited and eager to learn, but nervous initially. Achieved confidence and growth.', 'Applied knowledge effectively, communicated well, managed deadlines.', 'Adapting to fast pace, handling unexpected issues.', 'Now see adaptability and communication as vital. Growth opportunities exist.', 'Clearer expectations, more ongoing feedback, skill development support.', '2025-05-28 10:24:27'),
(2, '20253333', '1', 'Lwazi Sibeko', 'Initially hopeful and motivated; upon completion, proud of my progress.', 'Successfully learned new skills, improved team collaboration.', 'Balancing workload and unfamiliar tasks.', 'My perspective shifted to value continuous learning and resilience.', 'Enhanced onboarding and mentoring for better integration.', '2025-05-28 10:24:27'),
(3, '20254444', '1', 'Tammy Jacobs', 'Eager but unsure at first; became more confident and committed.', 'Strengthened problem-solving and time management skills.', 'Dealing with tight deadlines and multitasking.', 'Work is a valuable learning experience, emphasizing adaptability.', 'More structured reflection and feedback periods would help.', '2025-05-28 10:24:27'),
(4, '20255555', '1', 'Kgosi Mokoena', 'Concerned at first, but grew to enjoy the challenges.', 'Improved technical skills and teamwork.', 'Managing stress and handling complex tasks.', 'Work has broadened my perspective on professional growth.', 'Providing clearer goals and incremental check-ins would aid learning.', '2025-05-28 10:24:27'),
(5, '20256666', '1', 'Mpho Pule', 'Nervous initially, but excited about new opportunities.', 'Enhanced practical skills, built confidence.', 'Learning to manage time and unexpected problems.', 'My view now appreciates perseverance and proactive communication.', 'More structured mentorship and feedback; clearer expectations.', '2025-05-28 10:24:27'),
(6, '20257777', '1', 'Tiaan Jansen', 'Mixed feelings of anticipation and anxiety initially. Now more motivated.', 'Successful in project completion and teamwork.', 'Adapting to a dynamic environment.', 'Work experience emphasized the importance of flexibility and ongoing learning.', 'Regular progress check-ins and clearer instructions could improve experience.', '2025-05-28 10:24:27'),
(7, '20258888', '1', 'Bongi Khumalo', 'Initially unsure, but developed a positive outlook.', 'Gained valuable skills and confidence.', 'Handling unforeseen issues and workload management.', 'My thinking has shifted toward continuous improvement and resilience.', 'Better support in setting realistic goals and regular feedback.', '2025-05-28 10:24:27'),
(8, '20259999', '1', 'Victor Rossouw', 'Eager but cautious at first; ended with enthusiasm.', 'Successfully applied skills and learned new tools.', 'Difficulty in managing multiple priorities.', 'Perspective shifted to value adaptability and persistence.', 'More structured training sessions and feedback routines would help.', '2025-05-28 10:24:27'),
(9, '21904759', '1', 'Siphelele Maphumulo', 'Before starting, I felt excited and eager to learn, but also a bit nervous about my ability to meet expectations. Upon completion, I felt a sense of achievement and increased confidence, though I also recognized areas for growth.', 'I succeeded in applying theoretical knowledge to practical tasks, communicating effectively with team members, and managing deadlines efficiently.', 'I faced challenges in adapting to the fast-paced environment, handling unexpected issues, and balancing multiple responsibilities simultaneously.', 'My perspective has shifted to appreciate the importance of adaptability, continuous learning, and proactive communication. I now see work experiences as vital opportunities for growth and skill development.', 'I suggest clearer communication of expectations and objectives at the outset, more structured reflection and feedback sessions throughout the placement, and greater support in skill development to enhance the overall learning experience.', '2025-05-28 04:13:58'),
(10, '20251111', '1', 'Thabo Mkhize', 'This experience helped me develop greater self-discipline and resilience. It encouraged me to step out of my comfort zone and build confidence in my abilities.', 'I improved my problem-solving skills, time management, and teamwork. I also gained practical skills related to [specific field or task], which I hadn’t mastered before.', 'My attitude has become more positive and proactive. I now view challenges as opportunities to learn, and I am more motivated to pursue further professional development.', 'The most valuable lesson was understanding the importance of adaptability and open-mindedness in a work environment, which are crucial for personal and professional growth.', 'Yes, I would recommend it to others because it provides real-world insights, enhances practical skills, and helps build confidence. It’s an excellent stepping stone for career development.', '2025-05-28 10:21:53'),
(13, '21904759', '2', 'Siphelele Maphumulo', 'I felt excited and eager to learn, but also a bit nervous about my ability to meet expectations. Upon completion, I felt a sense of achievement and increased confidence, though I also recognized areas for growth.', 'I succeeded in applying theoretical knowledge to practical tasks, communicating effectively with team members, and managing deadlines efficiently.', 'I faced challenges in adapting to handling unexpected issues, and balancing multiple responsibilities simultaneously.', 'My perspective has shifted to continuous learning, and proactive communication. I now see work experiences as vital opportunities for growth and skill development.', 'I suggest clearer communication of expectations and objectives at the outset, more structured reflection and feedback sessions throughout the placement, and greater support in skill development to enhance the overall learning experience.', '2025-07-17 02:41:14');

-- --------------------------------------------------------

--
-- Table structure for table `student_signatures`
--

CREATE TABLE `student_signatures` (
  `id` int(11) NOT NULL,
  `student_id` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `signature_image` longtext NOT NULL,
  `signature_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `document_type` varchar(50) DEFAULT NULL,
  `document_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `student_users`
--

CREATE TABLE `student_users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `title` varchar(10) NOT NULL,
  `password` varchar(255) NOT NULL,
  `userRole` varchar(50) NOT NULL DEFAULT 'student',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('inactive','active','suspended','unenrolled') DEFAULT 'inactive'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `student_users`
--

INSERT INTO `student_users` (`id`, `email`, `title`, `password`, `userRole`, `created_at`, `status`) VALUES
(1, '20252222@live.mut.ac.za', 'Mr', '$2b$10$zIfOFm9Ge2ltsu2AcxT1eOwGwKvGWhajQOt.MNpxAUAj.A7ZZsUIe', 'student', '2025-06-06 01:25:48', 'inactive'),
(2, '20251111@live.mut.ac.za', 'Mr', '$2b$10$zIfOFm9Ge2ltsu2AcxT1eOwGwKvGWhajQOt.MNpxAUAj.A7ZZsUIe', 'student', '2025-05-01 03:45:56', 'inactive'),
(3, '20254444@live.mut.ac.za', 'Mr', '$2b$10$zIfOFm9Ge2ltsu2AcxT1eOwGwKvGWhajQOt.MNpxAUAj.A7ZZsUIe', 'student', '2025-06-06 01:25:48', 'inactive'),
(4, '20255555@live.mut.ac.za', 'Mrs', '$2b$10$zIfOFm9Ge2ltsu2AcxT1eOwGwKvGWhajQOt.MNpxAUAj.A7ZZsUIe', 'student', '2025-06-06 01:25:48', 'unenrolled'),
(5, '20256666@live.mut.ac.za', 'Mr', '$2b$10$zIfOFm9Ge2ltsu2AcxT1eOwGwKvGWhajQOt.MNpxAUAj.A7ZZsUIe', 'student', '2025-06-06 01:25:48', 'inactive'),
(6, '20257777@live.mut.ac.za', 'Mrs', '$2b$10$zIfOFm9Ge2ltsu2AcxT1eOwGwKvGWhajQOt.MNpxAUAj.A7ZZsUIe', 'student', '2025-06-06 01:25:48', 'inactive'),
(7, '20258888@live.mut.ac.za', 'Mr', '$2b$10$zIfOFm9Ge2ltsu2AcxT1eOwGwKvGWhajQOt.MNpxAUAj.A7ZZsUIe', 'student', '2025-06-06 01:25:48', 'inactive'),
(8, '20259999@live.mut.ac.za', 'Mrs', '$2b$10$zIfOFm9Ge2ltsu2AcxT1eOwGwKvGWhajQOt.MNpxAUAj.A7ZZsUIe', 'student', '2025-06-06 01:25:48', 'inactive'),
(9, '21904759@live.mut.ac.za', 'Mr', '$2b$10$1qXALDQ/RCStaP1bmZoffeqZ7.WkCbME8Owbpu9ru1ixUIynYNcGW', 'student', '2025-05-25 12:05:05', 'unenrolled'),
(12, '20253333@live.mut.ac.za', 'Mrs', '$2b$10$zIfOFm9Ge2ltsu2AcxT1eOwGwKvGWhajQOt.MNpxAUAj.A7ZZsUIe', 'student', '2025-06-06 01:25:48', 'inactive');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `title` varchar(10) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `userRole` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `title`, `password`, `created_at`, `userRole`) VALUES
(1, 'poswa@mut.ac.za', 'Dr', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW...', '2025-06-11 13:11:03', 'admin'),
(2, 'Mshengu.thuli@mut.ac.za', 'Mrs', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW...', '2025-05-01 16:38:26', 'admin'),
(3, 'thobile@mut.ac.za', 'Mr', '$2b$10$cYwhK/GdssH9Vg0tY2QCKuYGezg9Te1TfwPcjt.wT2z...', '2025-06-11 12:01:12', 'staff'),
(4, 'zanele@mut.ac.za', 'Mrs', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW...', '2025-06-11 13:13:23', 'staff'),
(5, 'ana@mut.ac.za', 'Mrs', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW...', '2025-06-11 13:13:23', 'staff'),
(7, 'govender.trishka@mut.ac.za', 'Mrs', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW...', '2025-06-11 13:19:44', 'staff'),
(8, 'toh@mut.ac.za', 'Mrs', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW...', '2025-06-11 13:19:44', 'staff'),
(9, 'mnguni.gugu@mut.ac.za', 'Mrs', '$2b$10$Y7c3cBTxurCJos7sUmzoY.oI6BjJD6dO6LiwpwDQKBW...', '2025-06-11 13:21:04', 'staff'),
(18, '21904759@live.mut.ac.za', 'Mr', '$2b$10$1qXALDQ/RCStaP1bmZoffeqZ7.WkCbME8Owbpu9ru1ixUIynYNcGW', '2025-05-25 12:05:05', 'student');

--
-- Triggers `users`
--
DELIMITER $$
CREATE TRIGGER `set_user_role_before_insert` BEFORE INSERT ON `users` FOR EACH ROW BEGIN
  IF NEW.email LIKE '%@live.mut.ac.za' THEN
    SET NEW.userRole = 'student';
  ELSEIF NEW.email LIKE '%@mut.ac.za' THEN
    SET NEW.userRole = 'staff';
  ELSE
    SET NEW.userRole = 'unknown';
  END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `wil_application`
--

CREATE TABLE `wil_application` (
  `id` int(11) NOT NULL,
  `province` varchar(100) DEFAULT NULL,
  `title` varchar(20) DEFAULT NULL,
  `initials` varchar(10) DEFAULT NULL,
  `surname` varchar(100) DEFAULT NULL,
  `first_names` varchar(100) DEFAULT NULL,
  `student_number` varchar(20) DEFAULT NULL,
  `level_of_study` varchar(50) DEFAULT NULL,
  `race` varchar(50) DEFAULT NULL,
  `gender` varchar(10) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `physical_address` text DEFAULT NULL,
  `home_town` varchar(100) DEFAULT NULL,
  `cell_phone_number` varchar(20) DEFAULT NULL,
  `municipality_name` varchar(100) DEFAULT NULL,
  `town_situated` varchar(100) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `contact_email` varchar(100) DEFAULT NULL,
  `telephone_number` varchar(20) DEFAULT NULL,
  `contact_cell_phone` varchar(20) DEFAULT NULL,
  `declaration_info_1` text DEFAULT NULL,
  `declaration_info_2` text DEFAULT NULL,
  `declaration_info_3` text DEFAULT NULL,
  `signature_image` varchar(255) DEFAULT NULL,
  `id_document` varchar(255) DEFAULT NULL,
  `cv_document` varchar(255) DEFAULT NULL,
  `status` varchar(45) DEFAULT 'Pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wil_application`
--

INSERT INTO `wil_application` (`id`, `province`, `title`, `initials`, `surname`, `first_names`, `student_number`, `level_of_study`, `race`, `gender`, `email`, `physical_address`, `home_town`, `cell_phone_number`, `municipality_name`, `town_situated`, `contact_person`, `contact_email`, `telephone_number`, `contact_cell_phone`, `declaration_info_1`, `declaration_info_2`, `declaration_info_3`, `signature_image`, `id_document`, `cv_document`, `status`, `created_at`, `updated_at`) VALUES
(1, 'KwaZulu-Natal', 'Mr', 'U1', 'User_1', 'User-1', '20251111', '1', 'African', 'Male', '20251111@live.mut.ac.za', '123 Main Street, Durban', 'Durban', '0731234567', 'eThekwini', 'Durban', 'Dr Zulu', 'zulu@mut.ac.za', '0311234567', '0739876543', '1', '1', '1', 'uploads/signatures/sig1.png', 'uploads/documents/id1.pdf', 'uploads/documents/cv1.pdf', 'Accepted', '2025-01-26 10:33:32', '2025-07-17 08:53:27'),
(2, 'Gauteng', 'Ms', 'U2', 'User_2', 'User-2', '20252222', '2', 'African', 'Female', '20252222@live.mut.ac.za', '45 City Road, JHB', 'Johannesburg', '0721234567', 'City of Johannesburg', 'Johannesburg', 'Dr Dlamini', 'dlamini@uj.ac.za', '0113456789', '0719876543', '1', '1', '1', 'uploads/signatures/sig2.png', 'uploads/documents/id.pdf', 'uploads/documents/cv.pdf', 'Rejected', '2025-04-26 10:33:32', '2025-07-17 08:53:15'),
(3, 'Eastern Cape', 'Mr', 'U3', 'User_3', 'User-3', '20253333', '2', 'Coloured', 'Male', '20253333@live.mut.ac.za', '789 East Avenue', 'East London', '0761234567', 'Nelson Mandela Bay', 'Richards Bay', 'Dr Mbeki', 'mbeki@wsu.ac.za', '0431234567', '0781234567', '1', '1', '1', 'uploads/signatures/sig3.png', 'id3.pdf', 'cv3.pdf', 'Accepted', '2025-04-26 10:33:32', '2025-07-17 08:53:11'),
(4, 'Western Cape', 'Ms', 'U4', 'User_4', 'User-4', '20254444', '4', 'White', 'Female', '20254444@live.mut.ac.za', '12 Beach Road', 'Cape Town', '0821234567', 'Cape Town', 'Cape Town', 'Dr Steyn', 'steyn@cput.ac.za', '0211234567', '0849876543', '1', '1', '1', 'uploads/signatures/sig4.png', 'id4.pdf', 'cv4.pdf', 'Accepted', '2025-03-26 10:33:32', '2025-07-17 08:53:02'),
(5, 'Limpopo', 'Mr', 'U5', 'User_5', 'User-5', '20255555', '3', 'African', 'Male', '20255555@live.mut.ac.za', '90 Hilltop Rd', 'Polokwane', '0711234567', 'Mhlathuza', 'Durban', 'Dr Maluleke', 'maluleke@ul.ac.za', '0151234567', '0799876543', '1', '1', '1', 'uploads/signatures/sig5.png', 'id5.pdf', 'cv5.pdf', 'Pending', '2025-04-26 10:33:32', '2025-07-17 08:52:58'),
(6, 'North West', 'Ms', 'U6', 'User_6', 'User-6', '20256666', '1', 'African', 'Female', '20256666@live.mut.ac.za', '88 Freedom St', 'Mafikeng', '0741234567', 'Rustenburg', 'Mafikeng', 'Dr Tshepo', 'tshepo@nwu.ac.za', '0181234567', '0829876543', '1', '1', '1', 'uploads/signatures/sig3.png', 'id6.pdf', 'cv6.pdf', 'Pending', '2025-04-26 10:33:32', '2025-07-17 08:52:53'),
(8, 'Mpumalanga', 'Ms', 'BK', 'Khumalo', 'Bongi Khumalo', '20258888', '3', 'African', 'Female', '20258888@live.mut.ac.za', '34 Sunshine Blvd', 'Mbombela', '0724567890', 'City of Johannesburg', 'Johannesburg', 'Dr Mthembu', 'mthembu@unisa.ac.za', '0131234567', '0831234567', '1', '1', '1', 'uploads/signatures/sig8.png', 'id8.pdf', 'cv8.pdf', 'Pending', '2025-04-26 10:33:32', '2025-05-04 09:54:49'),
(12, 'Eastern Cape', 'Mrs', 'LM', 'Mthethwa', 'Lungile', '21229678', '5', 'African', 'Female', '21229678@live.mut.ac.za', 'Unit 8E trio Industrial Park, 8 Shepstone Road, The Wolds, New Germany, South Africa', 'Durban', '0633137391', 'eThekwini', 'Durban', 'Sphelele Maphumulo', 'info@codingmadeeasy.org', '0743780928', '0605871744', '1', '1', '1', 'uploads\\1745320714301-292257806-Lungile Sign 2.png', 'uploads\\1745320714304-7980244-S.A Maphumulo DAMCOM December 2024 Timesheet.pdf', 'uploads\\1745320714310-895385704-S.A Maphumulo DAMCOM MAy2024 Timesheet.PDF_organized.pdf', 'Pending', '2025-04-26 10:33:32', '2025-05-04 09:53:41'),
(27, 'KwaZulu-Natal', 'Mr', 'SA', 'Maphumulo', 'Siphelele', '21904759', '1', 'African', 'Male', '21904759@live.mut.ac.za', 'Umlazi S210, 210', 'Durban', '0686764623', 'eThekwini', 'Durban', 'Siphelele Audacious Maphumulo', 'Djnewseason@gmail.com', '0686764623', '0684135633', '1', '1', '1', 'uploads\\1748174503600-440743204-0.png', 'uploads\\1748206173734-858775804-id1.pdf', 'uploads\\1748206173727-813947726-1745322748614-840215477-S.A Maphumulo DAMCOM March 2024 Timesheet_organized.pdf', 'Accepted', '2025-05-25 12:01:43', '2025-07-16 21:10:48'),
(28, 'Eastern Cape', 'Mr', 'NJ', 'Jwara', 'Nkosiphundule', '21220759', '4', 'African', 'Male', '21220759@live.mut.ac.za', 'LamontVille, Mthiyane Road', 'Durban', '0605871744', 'eThekwini', 'Durban', 'Mbalie Sibiya', 'MbalieSibiya@gmail.com', '0743780920', '0684135633', '1', '1', '1', 'uploads\\1752741724703-929316711-1746227877610-278440251-sig1.png', 'uploads\\1752741724704-264967714-id.pdf', 'uploads\\1752741724728-375797725-Siphelele Matric 2025(June).pdf', 'Pending', '2025-07-17 08:42:04', '2025-07-17 08:42:04');

-- --------------------------------------------------------

--
-- Table structure for table `wil_monitoring_visit`
--

CREATE TABLE `wil_monitoring_visit` (
  `visit_id` int(11) NOT NULL,
  `monitoring_id` int(11) DEFAULT NULL,
  `student_id` int(11) DEFAULT NULL,
  `visit_date` date DEFAULT NULL,
  `is_student_present` tinyint(1) DEFAULT NULL,
  `logbook_complete` tinyint(1) DEFAULT NULL,
  `record_keeping` tinyint(1) DEFAULT NULL,
  `student_contribution` text DEFAULT NULL,
  `listed_activities_covered` tinyint(1) DEFAULT NULL,
  `student_feedback` text DEFAULT NULL,
  `general_comments` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wil_placement_application`
--

CREATE TABLE `wil_placement_application` (
  `placement_id` int(11) NOT NULL,
  `student_id` int(11) DEFAULT NULL,
  `organisation_id` int(11) DEFAULT NULL,
  `mentor_id` int(11) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `placement_status` enum('Ongoing','Completed','Terminated') DEFAULT 'Ongoing',
  `placement_type` enum('Municipal Health Services','Provincial Health Institution') DEFAULT NULL,
  `is_information_correct` tinyint(1) DEFAULT NULL,
  `is_wil_preferred_area_communicated` tinyint(1) DEFAULT NULL,
  `no_reason_wil_attendance_prevented` tinyint(1) DEFAULT NULL,
  `declaration_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `wil_placement_monitoring`
--

CREATE TABLE `wil_placement_monitoring` (
  `monitoring_id` int(11) NOT NULL,
  `mut_staff_id` int(11) DEFAULT NULL,
  `organisation_id` int(11) DEFAULT NULL,
  `assigned_date` date DEFAULT NULL,
  `monitoring_plan_year` year(4) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `access_log`
--
ALTER TABLE `access_log`
  ADD PRIMARY KEY (`log_id`),
  ADD KEY `document_id` (`document_id`);

--
-- Indexes for table `activity_logsheet`
--
ALTER TABLE `activity_logsheet`
  ADD PRIMARY KEY (`logsheet_id`,`activity_id`),
  ADD KEY `idx_activity_logsheet_logsheet_id` (`logsheet_id`),
  ADD KEY `idx_activity_logsheet_activity_id` (`activity_id`);

--
-- Indexes for table `audit_log`
--
ALTER TABLE `audit_log`
  ADD PRIMARY KEY (`audit_id`);

--
-- Indexes for table `blocked_signups`
--
ALTER TABLE `blocked_signups`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `daily_logsheet`
--
ALTER TABLE `daily_logsheet`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `declaration_letters`
--
ALTER TABLE `declaration_letters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_student_name` (`student_name`),
  ADD KEY `idx_supervisor_name` (`supervisor_name`);

--
-- Indexes for table `declaration_report`
--
ALTER TABLE `declaration_report`
  ADD PRIMARY KEY (`declaration_id`),
  ADD KEY `idx_declaration_student_id` (`student_id`),
  ADD KEY `idx_declaration_mentor_id` (`mentor_id`);

--
-- Indexes for table `event_attendance`
--
ALTER TABLE `event_attendance`
  ADD PRIMARY KEY (`id`),
  ADD KEY `event_id` (`event_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `event_codes`
--
ALTER TABLE `event_codes`
  ADD PRIMARY KEY (`event_code`);

--
-- Indexes for table `guest_lectures`
--
ALTER TABLE `guest_lectures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `hospitals`
--
ALTER TABLE `hospitals`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `hpcsa_auditor`
--
ALTER TABLE `hpcsa_auditor`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `hi_number` (`hi_number`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `email_2` (`email`),
  ADD KEY `hi_number_2` (`hi_number`);

--
-- Indexes for table `hpcsa_report`
--
ALTER TABLE `hpcsa_report`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mentor_signatures`
--
ALTER TABLE `mentor_signatures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `mentor_id` (`mentor_id`),
  ADD KEY `document_type` (`document_type`,`document_id`);

--
-- Indexes for table `mentor_users`
--
ALTER TABLE `mentor_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `email_2` (`email`);

--
-- Indexes for table `municipalities`
--
ALTER TABLE `municipalities`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `mut_staff`
--
ALTER TABLE `mut_staff`
  ADD PRIMARY KEY (`mut_staff_number_id`),
  ADD UNIQUE KEY `mut_email` (`mut_email`);

--
-- Indexes for table `organisation`
--
ALTER TABLE `organisation`
  ADD PRIMARY KEY (`organisation_id`),
  ADD KEY `idx_organisation_name` (`organisation_name`);

--
-- Indexes for table `signup_codes`
--
ALTER TABLE `signup_codes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `application_id` (`application_id`);

--
-- Indexes for table `staff_codes`
--
ALTER TABLE `staff_codes`
  ADD PRIMARY KEY (`code`),
  ADD UNIQUE KEY `staff_email` (`staff_email`);

--
-- Indexes for table `staff_signatures`
--
ALTER TABLE `staff_signatures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `staff_id` (`staff_id`),
  ADD KEY `document_type` (`document_type`,`document_id`);

--
-- Indexes for table `staff_users`
--
ALTER TABLE `staff_users`
  ADD PRIMARY KEY (`staff_id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`student_number_id`),
  ADD UNIQUE KEY `student_email` (`student_email`),
  ADD UNIQUE KEY `id_number` (`id_number`),
  ADD KEY `idx_student_email` (`student_email`);

--
-- Indexes for table `student_documents`
--
ALTER TABLE `student_documents`
  ADD PRIMARY KEY (`document_id`),
  ADD KEY `student_number_id` (`student_number_id`);

--
-- Indexes for table `student_placements`
--
ALTER TABLE `student_placements`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_reflections`
--
ALTER TABLE `student_reflections`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_signatures`
--
ALTER TABLE `student_signatures`
  ADD PRIMARY KEY (`id`),
  ADD KEY `email` (`email`),
  ADD KEY `student_id` (`student_id`),
  ADD KEY `document_type` (`document_type`,`document_id`);

--
-- Indexes for table `student_users`
--
ALTER TABLE `student_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `wil_application`
--
ALTER TABLE `wil_application`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `wil_monitoring_visit`
--
ALTER TABLE `wil_monitoring_visit`
  ADD PRIMARY KEY (`visit_id`),
  ADD KEY `monitoring_id` (`monitoring_id`),
  ADD KEY `student_id` (`student_id`);

--
-- Indexes for table `wil_placement_application`
--
ALTER TABLE `wil_placement_application`
  ADD PRIMARY KEY (`placement_id`),
  ADD KEY `idx_placement_student_id` (`student_id`),
  ADD KEY `idx_placement_organisation_id` (`organisation_id`),
  ADD KEY `idx_placement_mentor_id` (`mentor_id`);

--
-- Indexes for table `wil_placement_monitoring`
--
ALTER TABLE `wil_placement_monitoring`
  ADD PRIMARY KEY (`monitoring_id`),
  ADD KEY `mut_staff_id` (`mut_staff_id`),
  ADD KEY `organisation_id` (`organisation_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `access_log`
--
ALTER TABLE `access_log`
  MODIFY `log_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `audit_log`
--
ALTER TABLE `audit_log`
  MODIFY `audit_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `blocked_signups`
--
ALTER TABLE `blocked_signups`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `daily_logsheet`
--
ALTER TABLE `daily_logsheet`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=105;

--
-- AUTO_INCREMENT for table `declaration_letters`
--
ALTER TABLE `declaration_letters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `declaration_report`
--
ALTER TABLE `declaration_report`
  MODIFY `declaration_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `event_attendance`
--
ALTER TABLE `event_attendance`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=99;

--
-- AUTO_INCREMENT for table `guest_lectures`
--
ALTER TABLE `guest_lectures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `hospitals`
--
ALTER TABLE `hospitals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `hpcsa_auditor`
--
ALTER TABLE `hpcsa_auditor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `hpcsa_report`
--
ALTER TABLE `hpcsa_report`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `mentor_signatures`
--
ALTER TABLE `mentor_signatures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `mentor_users`
--
ALTER TABLE `mentor_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `municipalities`
--
ALTER TABLE `municipalities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `organisation`
--
ALTER TABLE `organisation`
  MODIFY `organisation_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `signup_codes`
--
ALTER TABLE `signup_codes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `staff_signatures`
--
ALTER TABLE `staff_signatures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `staff_users`
--
ALTER TABLE `staff_users`
  MODIFY `staff_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `student_documents`
--
ALTER TABLE `student_documents`
  MODIFY `document_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_placements`
--
ALTER TABLE `student_placements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `student_reflections`
--
ALTER TABLE `student_reflections`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `student_signatures`
--
ALTER TABLE `student_signatures`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `student_users`
--
ALTER TABLE `student_users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `wil_application`
--
ALTER TABLE `wil_application`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `wil_monitoring_visit`
--
ALTER TABLE `wil_monitoring_visit`
  MODIFY `visit_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wil_placement_application`
--
ALTER TABLE `wil_placement_application`
  MODIFY `placement_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `wil_placement_monitoring`
--
ALTER TABLE `wil_placement_monitoring`
  MODIFY `monitoring_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `access_log`
--
ALTER TABLE `access_log`
  ADD CONSTRAINT `access_log_ibfk_1` FOREIGN KEY (`document_id`) REFERENCES `student_documents` (`document_id`);

--
-- Constraints for table `event_attendance`
--
ALTER TABLE `event_attendance`
  ADD CONSTRAINT `event_attendance_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `guest_lectures` (`id`),
  ADD CONSTRAINT `event_attendance_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `wil_application` (`id`);

--
-- Constraints for table `guest_lectures`
--
ALTER TABLE `guest_lectures`
  ADD CONSTRAINT `guest_lectures_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `signup_codes`
--
ALTER TABLE `signup_codes`
  ADD CONSTRAINT `signup_codes_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `wil_application` (`id`);

--
-- Constraints for table `student_documents`
--
ALTER TABLE `student_documents`
  ADD CONSTRAINT `student_documents_ibfk_1` FOREIGN KEY (`student_number_id`) REFERENCES `student` (`student_number_id`);

--
-- Constraints for table `student_signatures`
--
ALTER TABLE `student_signatures`
  ADD CONSTRAINT `student_signatures_ibfk_1` FOREIGN KEY (`student_id`) REFERENCES `wil_application` (`id`);

--
-- Constraints for table `wil_monitoring_visit`
--
ALTER TABLE `wil_monitoring_visit`
  ADD CONSTRAINT `wil_monitoring_visit_ibfk_1` FOREIGN KEY (`monitoring_id`) REFERENCES `wil_placement_monitoring` (`monitoring_id`),
  ADD CONSTRAINT `wil_monitoring_visit_ibfk_2` FOREIGN KEY (`student_id`) REFERENCES `student` (`student_number_id`);

--
-- Constraints for table `wil_placement_monitoring`
--
ALTER TABLE `wil_placement_monitoring`
  ADD CONSTRAINT `wil_placement_monitoring_ibfk_1` FOREIGN KEY (`mut_staff_id`) REFERENCES `mut_staff` (`mut_staff_number_id`),
  ADD CONSTRAINT `wil_placement_monitoring_ibfk_2` FOREIGN KEY (`organisation_id`) REFERENCES `organisation` (`organisation_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
